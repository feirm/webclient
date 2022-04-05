<template>
  <div class="flex justify-center items-center m-6 md:m-24">
    <div class="container w-4/5 md:w-2/5 rounded-lg p-12 shadow-sm bg-gray-100 mb-3 space-y-3">
      <h1
        class="text-2xl text-center font-semibold md:text-3xl text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600"
      >Login attempt</h1>
      <p class="text-gray-900 text-lg text-center">A login attempt has been detected for your Feirm account. Please review the details below and approve or decline the request.</p>

      <div class="flex space-x-3 justify-center">
        <button
          class="block w-full p-3 shadow-sm text-base font-medium rounded-md text-white bg-green-400 hover:bg-green-300 focus:outline-none"
        >Approve</button>

        <button
          class="block w-full p-3 shadow-sm text-base font-medium rounded-md text-white bg-red-400 hover:bg-red-300 focus:outline-none"
        >Decline</button>
      </div>
    </div>
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

    console.log(navigator.userAgent);

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
