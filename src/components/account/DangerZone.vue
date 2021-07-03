<template>
  <div class="space-y-3 p-2 md:p-0">
    <h1 class="text-xl text-red-500 font-light">Danger Zone</h1>

    <div class="border border-red-500 p-4 rounded-md space-y-3">
      <p>Be careful, these actions are permanent. There's no going back!</p>

      <div class="flex space-x-3">
        <button
          @click="logoutUser"
          class="transition duration-300 ease-in-out block px-3 py-2 text-sm border border-gray-300 shadow-sm font-medium rounded-md text-red-500 bg-white hover:bg-red-500 hover:text-white hover:border-red-500 focus:outline-none"
        >
          Logout
        </button>

        <button
          @click="togglePurgeWallet"
          class="transition duration-300 ease-in-out block px-3 py-2 text-sm border border-gray-300 shadow-sm font-medium rounded-md text-red-500 bg-white hover:bg-red-500 hover:text-white hover:border-red-500 focus:outline-none"
        >
          Purge Wallet
        </button>

        <button
          @click="toggleDeleteAccount"
          class="transition duration-300 ease-in-out block px-3 py-2 text-sm border border-gray-300 shadow-sm font-medium rounded-md text-red-500 bg-white hover:bg-red-500 hover:text-white hover:border-red-500 focus:outline-none"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>

  <confirm-modal
    v-if="doPurgeWallet"
    heading="Purge your cryptocurrency wallet?"
    message="This action will remove your cryptocurrency wallet from your Feirm account. If you don't have a backup of your 12/24-word mnemonic, your funds are unrecoverable."
    @confirmEvent="purgeWallet"
    @close="togglePurgeWallet"
  ></confirm-modal>

  <confirm-modal
    v-if="doDeleteAccount"
    heading="Delete your Feirm account"
    message="This action will permanently delete your Feirm account and all the data associated with it, such as your cryptocurrency wallet."
    @confirmEvent="deleteAccount"
    @close="toggleDeleteAccount"
  ></confirm-modal>
</template>

<script lang="ts">
import walletService from "@/service/api/walletService";
import ConfirmModal from "@/components/ConfirmModal.vue";

import { defineComponent, ref } from "vue";
import authService from "@/service/api/authService";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    ConfirmModal,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    // Logout the user
    const logoutUser = () => {
      store.dispatch("logout");
      window.location.href = "/";
    };

    // Delete/purge user wallet
    const doPurgeWallet = ref(false);

    const togglePurgeWallet = () => {
      doPurgeWallet.value = !doPurgeWallet.value;
    };

    const purgeWallet = async () => {
      try {
        await walletService.RemoveWallet();
        togglePurgeWallet();
      } catch (e) {
        console.log("[Wallet Deletion]:", e);
      }
    };

    // Delete user account
    const doDeleteAccount = ref(false);

    const toggleDeleteAccount = () => {
      doDeleteAccount.value = !doDeleteAccount.value;
    };

    const deleteAccount = async () => {
      try {
        await authService.DeleteAccount();
        toggleDeleteAccount();
        router.push("/");
      } catch (e) {
        console.log("[Account Deletion]:", e);
      }
    };

    return {
      logoutUser,

      doPurgeWallet,
      togglePurgeWallet,
      purgeWallet,

      doDeleteAccount,
      toggleDeleteAccount,
      deleteAccount,
    };
  },
});
</script>
