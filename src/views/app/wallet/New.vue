<template>
  <div class="flex flex-col bg-gray-100">
    <div class="w-full md:w-2/5 p-12 space-y-4 mx-auto">
      <h1 class="text-3xl font-light text-center">
        Welcome to the <span class="text-orange">Feirm</span> Platform.
      </h1>
      <p class="text-center">
        To get started, you need to create a wallet (or restore from a backup if
        you have one).
      </p>

      <div
        class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
      >
        <div class="px-4 py-5 sm:px-6">
          <!-- Content goes here -->
          <!-- We use less vertical padding on card headers on desktop than on body sections -->
          <h2 class="text-xl font-light text-center">
            Here is your brand new wallet
          </h2>
        </div>
        <div class="px-4 py-5 sm:p-6 space-y-2">
          <!-- Mnemonic showcase -->
          <p class="text-sm">Your mnemonic:</p>
          <div class="p-2 rounded bg-gray-200">
            <code>
              <p>{{ mnemonic }}</p>
            </code>
          </div>

          <!-- Mnemonic confirmation -->
          <p class="text-sm">Mnemonic confirmation:</p>
          <div class="pb-2">
            <textarea
              v-model="confirmMnemonic"
              class="resize w-full rounded-md"
            ></textarea>
          </div>

          <!-- Recovery -->
          <router-link
            to="/app/wallet/recovery"
            class="text-sm pt-2 font-medium text-gray-600 hover:text-gray-900"
          >
            Have a backup? Click to restore it here.
          </router-link>

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
      mnemonic: "",
      confirmMnemonic: ""
    };
  },
  methods: {
    async next() {
      // Confirm the mnemonics match
      if (this.mnemonic !== this.confirmMnemonic) {
        return this.$toast.error("Mnemonics do not match!");
      }

      // Create the wallet from the mnemonic
      ETHWallet.setMnemonic(this.mnemonic);

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
  async mounted() {
    // Generate and set mnemonic
    const mnemonic = ETHWallet.generateMnemonic();
    this.mnemonic = mnemonic;
  },
  setup() {
    const router = useRouter();

    return {
      router
    };
  }
});
</script>
