<template>
  <div class="flex flex-col bg-gray-100">
    <div class="w-full md:w-2/5 p-12 space-y-4 mx-auto">
      <h1 class="text-3xl font-light text-center">Here is your new wallet!</h1>
      <p>
        Below you will see your non-custodial cryptocurrency wallet. This means
        that you are in total control of your private keys - they never leave
        your device. Feirm cannot access the funds on your behalf, meaning it is
        important to keep this mnemonic safe!
      </p>

      <!-- Mnemonic showcase -->
      <div class="flex w-3/4 p-2 bg-gray-200 rounded justify-center mx-auto">
        <!-- Words 1-8 -->
        <div class="flex-col p-2">
          <div v-for="(word, index) in splitMnemonic" :key="word">
            <code v-if="index < 8">{{ index + 1 }}. {{ word }}</code>
          </div>
        </div>

        <!-- Words 9-16 -->
        <div class="flex-col p-2">
          <div v-for="(word, index) in splitMnemonic" :key="word">
            <code v-if="index >= 8 && index < 16"
              >{{ index + 1 }}. {{ word }}</code
            >
          </div>
        </div>

        <!-- Words 17-24 -->
        <div class="flex-col p-2">
          <div v-for="(word, index) in splitMnemonic" :key="word">
            <code v-if="index >= 16 && index < 24"
              >{{ index + 1 }}. {{ word }}</code
            >
          </div>
        </div>
      </div>

      <!-- Option for encrypted backup -->
      <div v-show="false" class="space-y-3">
        <p>
          Do you frequently find yourself changing devices? Having to restore
          your mnemonic every time can be a time consuming process. You can
          store an encrypted copy of your wallet which is linked to your Feirm
          account, and access your funds immediately when you sign into a new
          device.
        </p>

        <label class="flex items-center justify-center">
          <input type="checkbox" class="form-checkbox" v-model="cloudBackup" />
          <span class="ml-2"
            >Upload wallet to my
            <span class="text-orange">Feirm</span> account.</span
          >
        </label>
      </div>

      <div v-if="cloudBackup" class="p-3 rounded bg-yellow-200">
        <p>
          Your wallet will be AES encrypted before it is linked to your Feirm
          account. Do not solely rely on your wallet being linked to your
          account - always make sure you have a backup of your wallet for peace
          of mind.
        </p>
      </div>

      <!-- Move onto recovery -->
      <button
        @click="next"
        class="block p-3 rounded bg-orange-500 w-full text-yellow-900"
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
      cloudBackup: false,
    };
  },
  methods: {
    async next() {
      // Create the wallet from the mnemonic
      ETHWallet.setMnemonic(this.mnemonic);

      // Encrypt wallet
      const rootKey = account.getRootKey();
      const encryptedWallet = await ETHWallet.encrypt(rootKey);

      // If the user has backup enabled, send encrypted copy to API
      if (this.cloudBackup) {
        console.log("TODO: Send encrypted wallet to API...");
      }

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
