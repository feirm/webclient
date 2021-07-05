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
          class="rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-yellow-900 hover:bg-orange-400 sm:w-auto sm:text-sm"
        >
          Remember Key
        </button>
      </div>

      <BaseModal />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BaseModal from "@/components/modals/BaseModal.vue";
import SideNav from "@/components/account/SideNav.vue";

export default defineComponent({
  components: {
    BaseModal,
    SideNav,
  },
});
</script>
