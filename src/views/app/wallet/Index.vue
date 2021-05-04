<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl leading-tight text-gray-900">
          My Wallet
        </h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 class="text-2xl">{{ address }}</h1>
        <div class="p-3 rounded shadow" v-for="token in tokens" :key="token.name">
          <p>{{ token.name }}</p>
          <p>{{ token.contract }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import ethWallet from '@/class/wallets/eth-wallet';
import account from '@/class/account';
import Web3 from 'web3';

// ETH/BSC tokens
const tokens = [
  {
    name: "Feirm (XFE)",
    contract: "0x3de70dd9f65a860140f69f286a483f46e9be875a",
    network: "binance"
  }
]

export default {
  setup() {
    const open = ref(false);
    const address = ref();

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
    })

    return {
      address,
      open,
      tokens
    }
  },
}
</script>