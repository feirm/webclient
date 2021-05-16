<template>
  <navigation v-if="!$route.meta.hideNavigation" />
  <router-view />
  <Footer v-if="!$route.meta.hideNavigation" />

  <!-- Updater prompt -->
  <div
    v-if="isRefresh"
    @click="update"
    class="fixed bottom-0 right-0 m-8 w-5/8 md:w-full max-w-sm"
  >
    <div
      class="cursor-pointer w-full p-3 bg-green-200 rounded shadow-lg text-white"
    >
      <h2 class="text-2xl font-light mb-2 text-gray-900 text-center">
        Update available! 🥳
      </h2>
      <p v-if="!refreshing" class="text-gray-900">
        A new version of the Feirm Platform is now available. Please tap or
        click here to update.
      </p>
      <span v-if="refreshing">
        <svg
          class="animate-spin h-12 w-12 text-white mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer.vue";
import account from "./class/account";
import hexToBytes from "./helpers/hexToBytes";

export default defineComponent({
  components: {
    Navigation,
    Footer,
  },
  data() {
    return {
      registration: null,
      isRefresh: false,
      refreshing: false,
    };
  },
  methods: {
    updateUI(e: CustomEvent) {
      this.registration = e.detail;
      this.isRefresh = true;
    },
    update() {
      this.isRefesh = false;

      if (this.registration || this.registration.waiting) {
        this.registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    },
  },
  created() {
    // Check if there is a root key already saved to this device
    const rootKey = localStorage.getItem("rootKey");
    if (rootKey) {
      account.setRootKey(hexToBytes(rootKey));
    }

    // Event listener for service worker
    document.addEventListener("serviceWorkerUpdateEvent", this.updateUI, {
      once: true,
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (this.refreshing) {
        return;
      }

      this.refreshing = true;
      window.location.reload();
    });
  },
});
</script>
