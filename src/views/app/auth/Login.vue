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

      checkEmail: false,
      submitted: false,
    };
  },
  methods: {
    ...mapActions(["login", "setUsername"]),

    async loginRequest() {
      // Send a login request to users email address
      this.submitted = true;

      let tokenId: string;

      // Send off for a login request
      try {
        const res = await authService.CreateLoginRequest(this.username);
        tokenId = res.data.id;

      } catch (e) {
        this.submitted = false;
        return this.$toast.error(e.response.data.error);
      }

      // Prompt user to check their email
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

          // Push to login
          this.router.push("/app")
        }
      }, 4000)
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
