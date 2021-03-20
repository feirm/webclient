<template>
  <div
    class="min-h-screen relative flex items-center justify-center bg-grey-500"
  >
    <!-- Login form -->
    <div
      class="bg-gray-100 h-screen p-8 shadow-2xl sm:w-1/2 md:w-1/2 lg:w-1/4 sm:rounded md:rounded lg:rounded sm:h-full md:h-full lg:h-full"
    >
      <router-link to="/">
        <img
          class="mx-auto w-16 mb-5"
          src="@/assets/img/logo.png"
          alt="Feirm Logo"
        />
      </router-link>

      <div v-if="!readyToDecrypt">
        <h2 class="text-3xl font-light mb-4 text-center">Welcome back! 👋</h2>
        <p class="font-light mb-3">
          It is good to see you again, we have missed you! Please enter your
          login credentials.
        </p>

        <!-- Username/email input -->
        <label class="block mb-2 font-light text-gray-500"
          >Username or Email Address</label
        >
        <input
          class="w-full mb-2 border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200"
          v-model="username"
          type="text"
          autofocus
        />

        <!-- Password input -->
        <label class="block mb-2 font-light text-gray-500">Password</label>
        <input
          class="w-full mb-3 border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200"
          v-model="password"
          v-on:input="checkPassword"
          type="password"
        />

        <button class="block w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300" @click="submitLogin()">
          <p v-if="!submitted">Log in</p>
          <img v-else class="mx-auto w-6" src="@/assets/loading_spinner.svg" alt="Loading spinner"/>
        </button>
      </div>

      <!-- Account unlock/decryption -->
      <div v-if="readyToDecrypt">
        <h2 class="text-3xl font-light mb-4 text-center">Unlock your account 🔒</h2>
        <p class="font-light mb-3">
          We're almost there! Please enter the encryption key for your account.
        </p>

        <!-- Encryption key input -->
        <label class="block mb-2 font-light text-gray-500"
          >Encryption Key</label
        >
        <input
          class="w-full mb-3 border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200"
          v-model="encryptionKey"
          type="password"
          autofocus
        />

        <!-- Decrypt button -->
        <button class="block w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300" @click="decryptAccount()">
          <p v-if="!decrypting">Unlock</p>
          <img v-else class="mx-auto w-6" src="@/assets/loading_spinner.svg" alt="Loading spinner"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

import firebase from "firebase";
import { useRouter } from "vue-router";
import authService from "@/service/api/authService";
import { EncryptedAccount } from "@/models/account";
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

      // Fetch encrypted account payload
      try {
        const res = await authService.GetAccount();
        this.account = res.data as EncryptedAccount;

      } catch (e) {
        this.submitted = false;
        this.$toast.error(e);
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

        const rootKey = await account.decryptRootKey(this.encryptionKey, encryptedAccount);

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
