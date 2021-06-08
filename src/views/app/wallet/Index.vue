<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl leading-tight text-gray-900">My Wallet</h1>
    </div>
  </header>
  <div class="max-w-7xl mx-auto py-6 p-4 lg:px-8">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div
        v-for="coin in coins"
        :key="coin.ticker"
        class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
        @click="wallet(coin.ticker)"
      >
        <div class="flex-shrink-0">
          <img :src="coin.logo" class="w-12" alt="Feirm" />
        </div>
        <div class="flex-1 min-w-0">
          <a href="#" class="focus:outline-none">
            <span class="absolute inset-0" aria-hidden="true" />
            <p class="text-sm font-medium text-gray-900">
              {{ coin.name }}
            </p>
            <p class="text-sm text-gray-500 truncate">
              {{ coin.balance }} <b>{{ coin.ticker.toUpperCase() }}</b>
            </p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

import ethWallet from "@/class/wallets/eth-wallet";
import account from "@/class/account";

import { EncryptedWallet, EncryptedWalletV2 } from "@/models/wallet";

import { CoinFactory } from "@/class/coins";
import Web3 from "web3";
import walletService from "@/service/api/walletService";
import btcP2wpkhWallet from "@/class/wallets/btc-p2wpkh-wallet";

export default {
  setup() {
    const router = useRouter();
    const open = ref(false);
    const address = ref();

    const coins = CoinFactory.getCoins();

    // Navigate to specific wallet
    const wallet = (ticker: string) => {
      router.push("/app/wallet/" + ticker);
    };

    onBeforeMount(async () => {
      const rootKey = account.getRootKey();

      // Check for wallet before showing page
      try {
        const res = await walletService.GetWallet();
        if (res.data == null) {
          // Redirect to new wallet page
          return router.push("/app/wallet/new");
        }
      } catch (e) {
        console.log("[Wallet]: " + e.response.data.error);
      }

      // Fetch and decrypt wallet
      let wallet: EncryptedWallet | EncryptedWalletV2;
      try {
        const res = await walletService.GetWallet();
        wallet = res.data;
      } catch (e) {
        console.log("[Wallet]: " + e.response.data.error);
      }

      // Decrypt wallet and set mnemonic
      const mnemonic = await ethWallet.decryptWallet(rootKey, wallet);
      ethWallet.setMnemonic(mnemonic);
      btcP2wpkhWallet.setMnemonic(mnemonic);

      // Get address from wallet
      const w = ethWallet.getWallet();
      const address = w.getAddressString();

      // Handle wallet version updates (if any)
      await ethWallet.updateWallet(rootKey, wallet);

      // Iterate over all the tokens, establish Web3 connections and set balances
      for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];

        // Check if Bitcoin
        if (coin.network === "bitcoin") {
          const zpub = btcP2wpkhWallet.getZpub(coin.ticker);
          const xpub = btcP2wpkhWallet.getXpub(zpub);

          btcP2wpkhWallet.setZpub(zpub);
          btcP2wpkhWallet.setXpub(xpub);

          const address = btcP2wpkhWallet.getAddress(0, 0);
          const changeAddress = btcP2wpkhWallet.getAddress(1, 0);
          console.log("First main:", address);
          console.log("First change:", changeAddress);

          const wif = btcP2wpkhWallet.getPrivateKey(coin.ticker, 0, 0);
          console.log(wif);
        }

        // If token has a contract, fetch balance from contract
        if (coin.network === "binance" || coin.network === "ethereum") {
          if (coin.contract) {
            const contract = ethWallet.getContract(coin.contract, coin.network);
            const weiBalance = await contract.methods.balanceOf(address).call();

            // Convert Wei balance to Ether
            const balance = Web3.utils.fromWei(weiBalance, "ether");
            coins[i].balance = balance;
          } else {
            // Otherwise fetch balance for address
            const web3 = ethWallet.getWeb3(coin.network);
            const weiBalance = await web3.eth.getBalance(address);

            // Convert Wei balance to Ether
            const balance = Web3.utils.fromWei(weiBalance, "ether");
            coins[i].balance = balance;
          }
        }
      }
    });

    return {
      address,
      open,
      coins,
      wallet,
    };
  },
};
</script>
