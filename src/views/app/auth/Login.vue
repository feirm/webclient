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

      <form v-on:submit.prevent="loginRequest" class="space-y-3">
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

        <!-- TOTP token input -->
        <div v-if="totpEnabled" class="space-y-3">
          <label class="block text-orange">TOTP</label>
          <input
            class="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200"
            v-model="totp"
            type="number"
            placeholder="Six-digit token"
        />
        </div>

        <!-- Submit button -->
        <button
          class="block w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
          type="submit"
          :disabled="submitted"
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

      <!-- Check email prompt -->
      <div v-if="checkEmail" class="bg-green-300 text-center p-3 rounded">
        <p>Please check your email and approve the login request for your account. Keep this page open.</p>
      </div>
    </div>

    <!-- Image from Unsplash -->
    <div class="flex-auto bg-grey-500 text-gray-900 hidden lg:contents">
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

      totpEnabled: false,

      checkEmail: false,
      submitted: false,
    };
  },
  methods: {
    ...mapActions(["login", "setUsername"]),

    async loginRequest() {
      // There are two login options for an account - either magic link via email or TOTP token.
      // They should be handled accordingly in this function.

      // Set the submission state to true
      this.submitted = true;

      // Global token ID (used for email)
      let tokenId;

      // Send off for a generic login request
      if (!this.totpEnabled) {
        try {
          const res = await authService.CreateLoginRequest(this.username);

          if (res.data.totp) {
            this.totpEnabled = true;
            this.submitted = false;
            return
          }

          // Assign the token ID
          tokenId = res.data.id;
        } catch (e) {
          this.submitted = false;
          return this.$toast.error(e.response.data.error);
        }
      }

      // First lets handle TOTP as that is the simplest
      if (this.totpEnabled) {
        let encryptedAccount = {} as EncryptedAccount;

        try {
          // Send username and 6-digit token to API to fetch encrypted account and nonce to sign
          const res = await authService.CreateLoginRequestTOTP(this.username, this.totp);
          encryptedAccount = res.data;
        } catch (e) {
          this.submitted = false;
          return this.$toast.error(e.response.data.error);
        }

        // Attempt to decrypt the root key
        const rootKey = await account.decryptRootKey(this.password, encryptedAccount).catch(() => {
          this.submitted = false;
          this.checkEmail = false;

          return this.$toast.error("There was an error decrypting your account! Please try again!");
        })

        // Derive the identity keypair and sign the token nonce
        const keypair = await account.deriveIdentityKeypair(rootKey);
        const signature = await account.signMessage(keypair, encryptedAccount.token?.nonce!)

        // Send the token ID and signature back to the auth API to create a session
        try {
          const res = await authService.CreateLoginSession(this.username, encryptedAccount.token?.id!, signature);

          // Extract and set the access token, username
          const accessToken = res.data.access_token;
          this.login(accessToken);
          this.setUsername(this.username);
        } catch (e) {
          this.submitted = false;
          this.checkEmail = false;

          return this.$toast.error(e.response.data.error);
        }

        // Set root key
        account.setRootKey(rootKey);

        // Push to app home
        this.router.push("/app");
      }

      // If the account doesn't use TOTP, then it must use traditional emai)
      if (!this.totpEnabled) {
        this.checkEmail = true;

        // Check the status of the request every 4 seconds
        const interval = setInterval(async () => {
          const res = await authService.LoginRequestStatus(tokenId);

          if (res.data.approved !== false) {
            // Stop the interval and set encrypted account payload
            clearInterval(interval);
            const encryptedAccount = res.data as EncryptedAccount;

            // Decrypt root key
            const rootKey = await account.decryptRootKey(this.password, encryptedAccount).catch(() => {
              this.submitted = false;
              this.checkEmail = false;

              return this.$toast.error("There was an error decrypting your account! Please try again!");
            });

            // Derive identity keypair and sign the token nonce
            const keypair = await account.deriveIdentityKeypair(rootKey);
            const signature = await account.signMessage(keypair, encryptedAccount.token?.nonce!)

            // Send to API
            const tokenRes = await authService.CreateLoginSession(this.username, encryptedAccount.token?.id!, signature).catch(e => {
              this.submitted = false;
              this.checkEmail = false;

              return this.$toast.error(e.response.data.error);
            })

            const accessToken = tokenRes.data.access_token;

            // Set token and username in Vuex
            this.login(accessToken);
            this.setUsername(this.username);

            this.submitted = false;
            this.checkEmail = false;

            // Set root key
            account.setRootKey(rootKey);

            // Push to app home
            this.router.push("/app");
          }
        }, 4000);
      }
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
