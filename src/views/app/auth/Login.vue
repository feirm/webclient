<template>
  <div class="flex flex-row h-screen">
    <!-- Login form -->
    <div
      class="flex flex-col justify-center bg-gradient-to-t from-grey-500 to-grey-900 p-12 space-y-4 max-w-xl"
    >
      <img class="mx-auto w-24" src="@/assets/img/logo.webp" alt="Feirm Logo" />

      <h1 class="text-4xl text-center text-orange">
        Welcome back to Feirm! 👋
      </h1>
      <p class="text-lg text-gray-50">
        It is good to see you again! To pick up from where you left off, please
        enter the credentials for your Feirm account.
      </p>

      <form v-on:submit.prevent="submitLogin" class="space-y-3">
        <!-- Username -->
        <label class="block text-orange">Username</label>
        <input
          class="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200"
          v-model="username"
          type="text"
          placeholder="Please enter your username"
          autofocus
        />

        <!-- Password input -->
        <label class="block text-orange">Password</label>
        <input
          class="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200"
          v-model="password"
          type="password"
          placeholder="Please enter your password"
        />

        <!-- TOTP input -->
        <label class="block text-orange">TOTP Code</label>
        <input
          class="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200"
          v-model="totp"
          type="number"
          placeholder="Two-factor authentication code"
        />

        <!-- Submit button -->
        <button
          class="block w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
          type="submit"
        >
          <p v-if="!submitted">Log in</p>
          <img
            v-else
            class="mx-auto w-6"
            src="@/assets/loading_spinner.svg"
            alt="Loading spinner"
          />
        </button>
      </form>
    </div>

    <!-- Image from Unsplash -->
    <div class="flex-auto bg-grey-500 hidden lg:contents">
      <img
        class="object-right h-full w-full"
        src="https://images.unsplash.com/photo-1592838890225-2c052fa0cf34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        alt=""
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

import { useRouter } from "vue-router";
import authService from "@/service/api/authService";
import account from "@/class/account";
import { EncryptedAccount } from "@/models/account";

export default defineComponent({
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      totp: "",

      submitted: false,
      readyToDecrypt: false,
      decrypting: false
    };
  },
  methods: {
    ...mapActions(["login"]),

    async submitLogin() {
      this.submitted = true;

      // Send details to auth API
      try {
        const tokens = await authService.Login(this.username, this.totp);
        
        const accessToken = tokens.data.access_token;
        const newRefreshToken = tokens.data.refresh_token;

        // Update the refresh and access tokens in Vuex
        this.login({ accessToken, newRefreshToken })

      } catch (e) {
        this.submitted = false;
        return this.$toast.error(e.response.data.error);
      }

      // Attempt to decrypt the account
      try {
        // Fetch encrypted account payload
        const res = await authService.GetAccount();
        const encAccount = res.data as EncryptedAccount;

        // Decrypt root key with password
        const rootKey = await account.decryptRootKey(this.password, encAccount);
        account.setRootKey(rootKey);
      } catch (e) {
        this.submitted = false;
        return this.$toast.error("Failed to login, please try again.")
      }

      // Stop spinning and navigate to app page
      this.submitted = false;
      this.router.push("/app")
    },

    async decryptAccount() {
      // Decrypt the root key
      this.decrypting = true;

      try {
        // Fetch the encrypted account
        const res = await authService.GetAccount();
        const encryptedAccount = res.data;

        const rootKey = await account.decryptRootKey(
          this.encryptionKey,
          encryptedAccount
        );

        // We have the root key, so we can set it
        account.setRootKey(rootKey);
      } catch (e) {
        this.decrypting = false;
        return this.$toast.error("Failed to decrypt account! Please try again.");
      }

      // Push to main app route
      this.decrypting = false;
      this.router.push("/app");
    }
  },
  setup() {
    const router = useRouter();

    return {
      router
    };
  }
});
</script>
