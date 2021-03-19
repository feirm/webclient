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

      <div>
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

        <button
          class="block w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
          @click="submitLogin()"
        >
          Log in
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

import firebase from "firebase";

export default defineComponent({
  name: "Login",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    ...mapActions(["login"]),

    async submitLogin() {
      // Check if username is a valid email address. If not, append the custom email
      let customUsername = "";

      // Create a dummy email address pointed at '@users.feirm.com'
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
        const refreshToken = await credentials.user?.refreshToken;
        this.login({ idToken, refreshToken });
      } catch (e) {
        // Handle later...
        console.log(e);
      }
    }
  }
});
</script>
