<template>
  <div class="bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="max-w-3xl mx-auto p-8 pt-20 pb-20 md:p-20 md:pt-48 md:pb-48 text-center space-y-3"
      >
        <div
          v-show="confirmed"
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
        >
          <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>

        <div
          v-show="failed"
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
        >
          <XIcon class="h-6 w-6 text-red-500" aria-hidden="true" />
        </div>
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import authService from "@/service/api/authService";
import { defineComponent } from "vue";

import { CheckIcon, XIcon } from "@heroicons/vue/outline";

export default defineComponent({
  data() {
    return {
      confirmed: false,
      failed: false,
      message: "Verifying email address..."
    };
  },
  components: {
    CheckIcon,
    XIcon
  },
  async mounted() {
    // Extract token from route URL
    const token = this.$route.query.token;

    // Send token to API
    await authService
      .VerifyEmail(token)
      .then(res => {
        if (res.status === 200) {
          this.message = res.data;
          this.confirmed = true;
        }
      })
      .catch(e => {
        this.message = e.response.data.error;
        this.failed = true;
      });
  }
});
</script>
