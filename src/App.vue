<template>
  <navigation v-if="!$route.meta.hideNavigation" />
  <router-view />
  <Footer />

  <!-- Updater prompt -->
  <div
    v-if="isRefresh"
    @click="update"
    class="fixed bottom-0 right-0 m-8 w-5/6 md:w-full max-w-sm"
  >
    <div
      class="cursor-pointer w-full p-4 bg-green-500 rounded shadow-lg text-white"
    >
      <h2 class="text-2xl font-light mb-2">Update available! 🥳</h2>
      <p>
        There is an update available for the Feirm app. Please press here to
        automatically reload and install the update.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  components: {
    Navigation,
    Footer
  },
  data() {
    return {
      registration: null,
      isRefresh: false,
      refreshing: false
    };
  },
  methods: {
    updateUI(e: any) {
      this.registration = e.detail;
      this.isRefresh = true;
    },
    update() {
      this.isRefesh = false;

      if (this.registration || this.registration.waiting) {
        this.registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    }
  },
  created() {
    document.addEventListener("serviceWorkerUpdateEvent", this.updateUI, {
      once: true
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (this.refreshing) {
        return;
      }

      this.refreshing = true;
      window.location.reload();
    });
  }
});
</script>
