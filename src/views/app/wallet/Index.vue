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
        <img :src="token.logo" class="w-12" alt="Feirm">
      </div>
      <div class="flex-1 min-w-0">
        <a href="#" class="focus:outline-none">
          <span class="absolute inset-0" aria-hidden="true" />
          <p class="text-sm font-medium text-gray-900">
            {{ token.name }}
          </p>
          <p class="text-sm text-gray-500 truncate">
            0.00 <b>{{ token.ticker.toUpperCase() }}</b>
          </p>
        </a>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import ethWallet from "@/class/wallets/eth-wallet";
import account from "@/class/account";
import Web3 from "web3";
import { useRouter } from 'vue-router';

// ETH/BSC tokens
const tokens = [
  {
    name: "Feirm (XFE)",
    ticker: "xfe",
    logo: require("@/assets/img/logo.webp"),
    contract: "0x3de70dd9f65a860140f69f286a483f46e9be875a",
    network: "binance",
  },
  {
    name: "Binance Coin (BNB)",
    ticker: "bnb",
    logo: require("@/assets/img/binance.png"),
    contract: "",
    network: "binance",
  },
];

export default {
  setup() {
    const router = useRouter();
    const open = ref(false);
    const address = ref();

    // Navigate to specific wallet
    const wallet = (ticker) => {
      router.push("/app/wallet/" + ticker);
    }

    onMounted(async () => {
      // Check for encrypted wallet in IDB
      const wallet = await ethWallet.getFromDisk();

      // TODO: Check wallet microservice. If there is no wallet for the user, redirect them to the wizard

      // Decrypt wallet and set mnemonic
      const rootKey = account.getRootKey();
      const mnemonic = await ethWallet.decryptWallet(rootKey, wallet);
      ethWallet.setMnemonic(mnemonic);

      // Create a new provider and Web3
      const provider = ethWallet.createProvider("bsc");
      const web3 = new Web3(provider);

      const addresses = await web3.eth.getAccounts();
      address.value = addresses[0];
    });

    return {
      address,
      open,
      tokens,
      wallet
    };
  },
};
</script>