<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl leading-tight text-gray-900">My Wallet</h1>
    </div>
  </header>
  <div class="max-w-7xl mx-auto py-6 p-4 lg:px-8">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div
        v-for="token in tokens"
        :key="token.ticker"
        class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
        @click="wallet(token.ticker)"
      >
        <div class="flex-shrink-0">
          <img :src="token.logo" class="w-12" alt="Feirm" />
        </div>
        <div class="flex-1 min-w-0">
          <a href="#" class="focus:outline-none">
            <span class="absolute inset-0" aria-hidden="true" />
            <p class="text-sm font-medium text-gray-900">
              {{ token.name }}
            </p>
            <p class="text-sm text-gray-500 truncate">
              {{ token.balance }} <b>{{ token.ticker.toUpperCase() }}</b>
            </p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import ethWallet from "@/class/wallets/eth-wallet";
import account from "@/class/account";

import { EncryptedWallet } from "@/models/wallet";

import { CoinFactory } from "@/class/coins";
import Web3 from "web3";
import walletService from "@/service/api/walletService";

export default {
  setup() {
    const router = useRouter();
    const open = ref(false);
    const address = ref();

    const tokens = CoinFactory.getCoins();

    // Navigate to specific wallet
    const wallet = (ticker) => {
      router.push("/app/wallet/" + ticker);
    };

    // Check for wallet before showing page
    onBeforeMount(async () => {
      try {
        const res = await walletService.GetWallet();
        if (res.data == null) {
          // Redirect to new wallet page
          return router.push("/app/wallet/new");
        }
      } catch (e) {
        console.log("[Wallet]: " + e.response.data.error);
      }
    });

    onMounted(async () => {
      // Fetch and decrypt wallet
      let wallet: EncryptedWallet;
      try {
        const res = await walletService.GetWallet();
        wallet = res.data;
      } catch (e) {
        console.log("[Wallet]: " + e.response.data.error);
      }

      // Decrypt wallet and set mnemonic
      const rootKey = account.getRootKey();
      const mnemonic = await ethWallet.decryptWallet(rootKey, wallet);
      ethWallet.setMnemonic(mnemonic);

      // Get address from wallet
      const w = ethWallet.getWallet();
      const address = w.getAddressString();

      // Iterate over all the tokens, establish Web3 connections and set balances
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // If token has a contract, fetch balance from contract
        if (token.contract) {
          const contract = ethWallet.getContract(token.contract, token.network);
          const weiBalance = await contract.methods.balanceOf(address).call();

          // Convert Wei balance to Ether
          const balance = Web3.utils.fromWei(weiBalance, "ether");
          tokens[i].balance = balance;
        } else {
          // Otherwise fetch balance for address
          const web3 = ethWallet.getWeb3(token.network);
          const weiBalance = await web3.eth.getBalance(address);

          // Convert Wei balance to Ether
          const balance = Web3.utils.fromWei(weiBalance, "ether");
          tokens[i].balance = balance;
        }
      }
    });

    return {
      address,
      open,
      tokens,
      wallet,
    };
  },
};
</script>
