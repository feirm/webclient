<template>
  <navigation v-if="!$route.meta.hideNavigation" />
  <div class="bg-gray-100">
    <button v-if="isRefresh" @click="update">Update me!</button>
  </div>
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
