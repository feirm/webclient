<template>
  <navigation v-if="!$route.meta.hideNavigation" />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Navigation from "@/components/Navigation.vue";

export default defineComponent({
  components: {
    Navigation
  },
  data () {
    return {
      registration: null,
      isRefresh: false,
      refreshing: false
    }
  },
  methods: {
    updateUI(e: any) {
      this.registration = e.detail;
      this.isRefresh = true;
    },
    update() {
      this.isRefesh = false;

      if (this.registration || this.registration.waiting) {
        this.registration.waiting.postMessage({ type: "SKIP_WAITING" })
      }
    }
  },
  created() {
    document.addEventListener('serviceWorkerUpdateEvent', this.updateUI, { once: true });

    // Update notification toast
    if (this.isRefresh) {
      this.$toast.info("A new update is available! Click me to reload.", {
        onclick: this.update()
      });
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) {
        return;
      }

      this.refreshing = true;
      window.location.reload();
    })
  }
});
</script>
