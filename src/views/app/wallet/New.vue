<template>
  <div class="flex flex-col bg-gray-100">
    <div class="w-full md:w-2/5 p-12 space-y-4 mx-auto">
      <h1 class="text-3xl font-light text-center">Here is your new wallet!</h1>
      <p>
        Below you will see your non-custodial cryptocurrency wallet. This means
        that you are in total control of your private keys - the mnemonic you
        see below never leaves your device. To make sure you get the full Feirm
        experience, an encrypted version of this wallet will be linked to your
        account allowing you to access your funds instantly on any device.
      </p>

      <!-- Mnemonic showcase -->
      <div class="flex md:w-3/4 p-2 rounded-lg justify-center mx-auto">
        <!-- Words 1-8 -->
        <div class="flex-col p-2 space-y-2 mt-2">
          <div v-for="(word, index) in splitMnemonic" :key="word">
            <span
              v-if="index < 8"
              class="p-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800 w-28"
            >
              <p>{{ index + 1 }}. {{ word }}</p>
            </span>
          </div>
        </div>

        <!-- Words 9-16 -->
        <div class="flex-col p-2 space-y-2">
          <div v-for="(word, index) in splitMnemonic" :key="word">
            <span
              v-if="index >= 8 && index < 16"
              class="p-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800 w-28"
            >
              <p>{{ index + 1 }}. {{ word }}</p>
            </span>
          </div>
        </div>

        <!-- Words 17-24 -->
        <div class="flex-col p-2 space-y-2">
          <div v-for="(word, index) in splitMnemonic" :key="word">
            <span
              v-if="index >= 16 && index < 24"
              class="p-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800 w-28"
            >
              <p>{{ index + 1 }}. {{ word }}</p>
            </span>
          </div>
        </div>
      </div>

      <!-- Move onto recovery -->
      <button
        @click="next"
        class="rounded shadow bg-orange-500 w-24 md:w-full mx-auto text-yellow-900 px-5 py-2 text-sm font-medium"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import ETHWallet from "@/class/wallets/eth-wallet";
import account from "@/class/account";

export default defineComponent({
  data() {
    return {
      mnemonic: "",
      splitMnemonic: [],
    };
  },
  methods: {
    async next() {
      // Create the wallet from the mnemonic
      ETHWallet.setMnemonic(this.mnemonic);

      // Encrypt wallet
      const rootKey = account.getRootKey();
      const encryptedWallet = await ETHWallet.encrypt(rootKey);

      // TODO: Upload encrypted wallet to API

      // Save wallet to disk
      await ETHWallet.saveToDisk(encryptedWallet);
      this.router.push("/app/wallet");
    },
  },
  async mounted() {
    // Generate and set mnemonic
    const mnemonic = ETHWallet.generateMnemonic();
    this.mnemonic = mnemonic;

    // Split the mnemonic
    this.splitMnemonic = mnemonic.split(" ");
  },
  setup() {
    const router = useRouter();

    return {
      router,
    };
  },
});
</script>
