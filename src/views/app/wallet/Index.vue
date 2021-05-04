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
        {{ mnemonic }}
      </div>
    </main>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import ethWallet from '@/class/wallets/eth-wallet'
import account from '@/class/account'

export default {
  setup() {
    const open = ref(false);
    const mnemonic = ref();

    onMounted(async () => {
      // Check for encrypted wallet in IDB
      const wallet = await ethWallet.getFromDisk();

      // TODO: Check wallet microservice

      // Decrypt wallet and set mnemonic
      const rootKey = account.getRootKey();
      mnemonic.value = await ethWallet.decryptWallet(rootKey, wallet);
    })

    return {
      open,
      mnemonic
    }
  },
}
</script>