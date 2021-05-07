<template>
  <div class="p-8 text-center">
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
import authService from "@/service/api/authService";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      message: "Verifying email address..."
    };
  },
  async mounted() {
    // Extract token from route URL
    const token = this.$route.query.token;

    // Send token to API
    await authService
      .ApproveLogin(token)
      .then(res => {
        if (res.status === 200) {
          this.message =
            "Login approved. Please go back to your previous page.";
        }
      })
      .catch(e => {
        this.message = e.response.data.error;
      });
  }
});
</script>
