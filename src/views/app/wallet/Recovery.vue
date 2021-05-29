<template>
  <div class="flex flex-col bg-gray-100">
    <div class="w-full md:w-2/5 p-12 space-y-4 mx-auto">
      <h1 class="text-3xl font-light text-center">
        Recover your <span class="text-orange">Feirm</span> Platform wallet.
      </h1>

      <div
        class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
      >
        <div class="px-4 py-5 sm:px-6">
          <!-- Content goes here -->
          <!-- We use less vertical padding on card headers on desktop than on body sections -->
          <h2 class="text-xl font-light text-center">
            Please enter your 12/24-word mnemonic below
          </h2>
        </div>
        <div class="px-4 py-5 sm:p-6 space-y-2">
          <!-- Mnemonic confirmation -->
          <p class="text-sm">Mnemonic:</p>
          <div class="pb-2">
            <textarea
              v-model="mnemonic"
              class="resize w-full rounded-md"
            ></textarea>
          </div>

          <button
            @click="next"
            class="rounded shadow bg-orange-500 w-24 md:w-full mx-auto text-yellow-900 px-5 py-2 text-sm font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import ETHWallet from "@/class/wallets/eth-wallet";
import account from "@/class/account";
import walletService from "@/service/api/walletService";

export default defineComponent({
  data() {
    return {
      mnemonic: ""
    };
  },
  methods: {
    async next() {
      // Create the wallet from the mnemonic
      try {
        ETHWallet.setMnemonic(this.mnemonic);
      } catch (e) {
        return this.$toast.error(e);
      }

      // Encrypt wallet
      const rootKey = account.getRootKey();
      const encryptedWallet = await ETHWallet.encrypt(rootKey);

      // Upload encrypted wallet to API
      try {
        await walletService.AddWallet(encryptedWallet);
      } catch (e) {
        return this.$toast.error(e.response.data.error);
      }

      this.router.push("/app/wallet");
    }
  },
  setup() {
    const router = useRouter();

    return {
      router
    };
  }
});
</script>
