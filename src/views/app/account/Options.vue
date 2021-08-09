<template>
  <div class="flex p-4 space-x-4 justify-center">
    <div class="w-2/12">
      <SideNav />
    </div>
    <div class="container w-full md:w-2/5 border rounded-md p-4 space-y-3">
      <h1 class="text-3xl font-light">Options</h1>
      <p>
        Make some changes which affect the way the Feirm Platform runs on your
        device.
      </p>

      <hr />

      <!-- Remember account encrpyption key -->
      <div class="space-y-2">
        <h2 class="text-xl">Remember Account Key</h2>
        <p class="text-sm">
          Your Feirm account key is a key used to encrypt your data (such as
          wallet) on the platform. Only you have access to this key as it
          remains in your browser. Letting your browser remember this key allows
          you to remain logged in to your Feirm account on this device.
        </p>

        <button
          type="button"
          @click="toggleRememberModal"
          class="rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-yellow-900 hover:bg-orange-400 sm:w-auto sm:text-sm"
        >
          {{ savedAccountKey ? "Remove" : "Remember Key" }}
        </button>
      </div>

      <BaseModal />
    </div>

    <confirm-modal
      v-if="openRememberModal"
      heading="Remember your account key?"
      message="This action will save your Feirm account key in your browser so you don't have to login every time your visit."
      @confirmEvent="saveAccountKey"
      @close="openRememberModal = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import BaseModal from "@/components/modals/BaseModal.vue";
import SideNav from "@/components/account/SideNav.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import account from "@/class/account";
import bufferToHex from "@/helpers/bufferToHex";

export default defineComponent({
  components: {
    BaseModal,
    SideNav,
    ConfirmModal,
  },
  setup() {
    const rootKey = localStorage.getItem("rootKey");
    const savedAccountKey = ref(rootKey ? true : false);

    const openRememberModal = ref(false);

    // Remove key if necessary or show remember me modal
    const toggleRememberModal = () => {
      if (savedAccountKey.value) {
        localStorage.removeItem("rootKey");
        openRememberModal.value = false;
        savedAccountKey.value = false;
      } else {
        openRememberModal.value = true;
      }
    };

    const saveAccountKey = () => {
      localStorage.setItem("rootKey", bufferToHex(account.getRootKey()));
      savedAccountKey.value = true;
      openRememberModal.value = false;
    };

    return {
      openRememberModal,
      toggleRememberModal,
      savedAccountKey,
      saveAccountKey,
    };
  },
});
</script>
