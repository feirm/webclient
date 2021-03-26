<template>
  <div class="flex flex-row h-screen">
    <!-- Login form -->
    <div class="flex flex-col justify-center bg-gradient-to-t from-grey-500 to-grey-900 p-12 space-y-4 max-w-xl">
      <img class="mx-auto w-24" src="@/assets/img/logo.webp" alt="Feirm Logo" />

      <h1 class="text-4xl text-center text-orange">Welcome back! 👋</h1>
      <p class="text-lg text-gray-50">It is good to see you again! To get back to where you left off, please enter the credentials for your Feirm account below.</p>

      <form v-on:submit.prevent="submitLogin" class="space-y-3">
        <!-- Username/email input -->
        <label class="block text-orange">Username or Email Address</label>
        <input class="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200" v-model="username" type="text" placeholder="Please enter your username/email address" autofocus />

        <!-- Password input -->
        <label class="block text-orange">Password</label>
        <input class="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200" v-model="password" v-on:input="checkPassword" type="password" placeholder="Please enter your password" />
      
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
      <img class="object-right h-full w-full" src="https://images.unsplash.com/photo-1592838890225-2c052fa0cf34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

import firebase from "firebase";
import { useRouter } from "vue-router";
import authService from "@/service/api/authService";
import account from "@/class/account";

export default defineComponent({
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      encryptionKey: "",

      submitted: false,
      readyToDecrypt: false,
      decrypting: false
    };
  },
  methods: {
    ...mapActions(["login"]),

    async submitLogin() {
      this.submitted = true;

      // Check if username is a valid email address. If not, append the custom email
      let customUsername = "";
      if (this.username && !this.username.includes("@")) {
        customUsername = this.username + "@users.feirm.com";
      } else {
        customUsername = this.username;
      }

      try {
        // Sign-in using username/email and password
        const credentials = await firebase
          .auth()
          .signInWithEmailAndPassword(customUsername, this.password);

        // Fetch access token and refresh token
        const idToken = await credentials.user?.getIdToken(true);
        const refreshToken = credentials.user?.refreshToken;

        // Save tokens in Vuex state
        this.login({ idToken, refreshToken });
      } catch (e) {
        this.submitted = false;

        // These errors are going to be coming from Firebase authentication,
        // so make the responses more meaniningful.
        const error = e.code;

        switch (error) {
          case "auth/wrong-password": {
            this.$toast.error("Invalid username/email address or password!");
            break;
          }
          case "auth/invalid-email": {
            this.$toast.error("Invalid username/email address or password!");
            break;
          }
          case "auth/user-not-found": {
            this.$toast.error("This user does not exist!");
            break;
          }
          default: {
            // Something else has gone wrong, or we want to provide a custom error message
            this.$toast.error(e);
            break;
          }
        }

        return;
      }

      // If we made it this far, we are ready to attempt decryption
      this.submitted = false;
      this.readyToDecrypt = true;
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

        // Save the encrypted account to IDB
        await account.saveAccount(encryptedAccount);
      } catch (e) {
        console.log(e);

        this.decrypting = false;
        this.$toast.error("Failed to unlock account! Please try again.");

        return;
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
