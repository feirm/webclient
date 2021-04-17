<template>
  <div class="flex flex-row h-screen">
    <!-- Signup form -->
    <div
      class="flex flex-col justify-center bg-gradient-to-t from-grey-500 to-grey-900 p-6 md:p-12 w-full"
    >
      <div
        class="bg-white p-4 md:p-8 rounded shadow md:w-1/3 mx-auto"
      >
        <img
          class="mx-auto w-16"
          src="@/assets/img/logo.webp"
          alt="Feirm Logo"
        />

        <!-- Details -->
        <div v-if="step === 0" class="space-y-3">
          <h1 class="text-3xl md:text-4xl text-center text-orange font-light">
            Create your Feirm account!
          </h1>
          <p class="md:text-lg text-left text-gray-900">
            Welcome! Feirm is the all-in-one platform for your cryptocurrency
            needs. Getting started won't take long!
          </p>

          <form v-on:submit.prevent="checkForm" class="space-y-3">
            <!-- Email input -->
            <label class="block text-gray-900">Email address</label>
            <input
              class="w-full border-2 border-gray-200 p-2 md:p-3 rounded outline-none focus:border-orange-500 transition duration-200"
              v-model="email"
              type="text"
              placeholder="Please enter an email address"
              autofocus
            />

            <!-- Username input -->
            <label class="block text-gray-900">Username</label>
            <input
              class="w-full border-2 border-gray-200 p-2 md:p-3 rounded outline-none focus:border-orange-500 transition duration-200"
              v-model="username"
              type="text"
              placeholder="Please pick a username"
              v-on:input="usernameValid($event.target.value)"
            />

            <p class="text-red-400" v-if="error">{{ error }}</p>

            <!-- Password input -->
            <label class="block text-gray-900">Password</label>
            <input
              class="w-full border-2 border-gray-200 p-2 md:p-3 rounded outline-none focus:border-orange-500 transition duration-200"
              v-model="password"
              type="password"
              placeholder="Please enter your password"
              v-on:input="checkPassword"
            />

            <meter max="4" id="password-strength-meter"></meter>
            <p class="text-grey-400 text-center" v-if="pwError">{{ pwError }}</p>

            <!-- Password confirmation input -->
            <label class="block text-gray-900">Confirm password</label>
            <input
              class="w-full border-2 border-gray-200 p-2 md:p-3 rounded outline-none focus:border-orange-500 transition duration-200"
              v-model="confirmPassword"
              type="password"
              placeholder="Please confirm your password"
            />

            <!-- Submit button -->
            <button
              class="block w-full bg-orange-500 hover:bg-orange-400 p-3 md:p-4 rounded text-yellow-900 transition duration-300"
              type="submit"
            >
              <p v-if="!submitted">Submit</p>
              <img
                v-else
                class="mx-auto w-6"
                src="@/assets/loading_spinner.svg"
                alt="Loading spinner"
              />
            </button>

            <p class="text-center">
              Already have an account?
              <router-link to="/app/login" class="text-orange"
                >Sign in</router-link
              >.
            </p>
          </form>
        </div>

        <!-- Disclaimer -->
        <div v-if="step === 1" class="space-y-3">
          <h1 class="text-3xl md:text-4xl text-center text-orange font-light">
            Disclaimer
          </h1>

          <p class="md:text-lg text-center text-gray-900">
            You understand that due to the nature of client-side encryption, Feirm cannot recover your account or wallet(s) in the event you forget your password or mnemonic.
          </p>

          <p class="md:text-lg text-center text-gray-900">
            Additionally, if you lose access to your two-factor authentication device and recovery codes, Feirm cannot reset this on your behalf.
          </p>

          <p class="md:text-lg text-center text-gray-900">
            By accepting, you understand all of the above and agree to the Feirm
            <router-link class="text-orange" to="/privacy">privacy policy</router-link> enforced throughout our projects.
          </p>

          <button @click="register" class="block w-full p-3 rounded shadow bg-orange-500 text-yellow-900">I agree</button>
          <router-link to="/" class="block w-full p-3 rounded shadow bg-red-400 text-red-900 text-center">I do not agree</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import authService from "@/service/api/authService";
import zxcvbn from "zxcvbn";

import { defineComponent } from "vue";
import account from "@/class/account";
import { EncryptedAccount } from "@/models/account";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import bufferToHex from "@/helpers/bufferToHex";

export default defineComponent({
  name: "Signup",
  data() {
    return {
      step: 0,

      email: "",
      username: "",
      password: "",

      error: "",
      pwError: "",
      debounce: null
    };
  },
  methods: {
    async usernameValid(username: string) {
      // Check to see if username exists
      // Wrap in a timeout to simulate debounce (refactor this later)
      clearTimeout(this.debounce);
      this.debounce = setTimeout(async () => {
        this.error = "";

        try {
          await authService.CheckUsername(username);
        } catch (e) {
          return this.error = e.response.data.error;
        }
      }, 600);
    },

    checkPassword() {
      // Check password strength with ZXCVBN
      const pw = zxcvbn(this.password);
      
      const meter: any = document.getElementById('password-strength-meter');
      meter.value = pw.score;

      switch (pw.score) {
        case 0:
          this.pwError = "Password is very weak!"
          break;

        case 1:
          this.pwError = "Password is weak!"
          break;

        case 2:
          this.pwError = "Password is medium!";
          break;

        case 3:
          this.pwError = "Password is strong!";
          break;
        
        case 4:
          this.pwError = "Password is very strong!";
          break;
      
        default:
          break;
      }
    },

    async checkForm() {
      // Check if username is empty
      if (!this.username) {
        return this.$toast.error("Username cannot be empty!");
      }

      // Checker if username valid
      try {
        await authService.CheckUsername(this.username);
      } catch (e) {
        return this.$toast.error(e.response.data.error);
      }

      // Check if passwords are empty
      if (!this.password || !this.confirmPassword) {
        return this.$toast.error("Passwords cannot be empty!");
      }

      // Check if passwords match
      if (this.password != this.confirmPassword) {
        return this.$toast.error("Passwords do not match!");
      }

      // Continue to disclaimer page
      this.step++;
    },
    async register() {
      // Generate a root key and encrypt it
      const rootKey = account.generateRootKey();
      const encryptedKey = await account.generateEncryptedRootKey(rootKey, this.password);

      // Derive identity keypair
      const keypair = await account.deriveIdentityKeypair(rootKey);

      // Bundle it into an account object
      const encryptedAccount: EncryptedAccount = {
        email: this.email,
        username: this.username,
        identity_pubkey: bufferToHex(keypair.getPublic()),
        encrypted_key: encryptedKey
      };

      // Submit account object to API
      try {
        const res = await authService.CreateAccount(encryptedAccount);

        // Extract tokens
        const accessToken = res.data.access_token;
        const refreshToken = res.data.refresh_token;

        // Set refresh and access tokens
        this.store.dispatch("login", { accessToken, refreshToken });
      } catch (e) {
        return this.$toast.error(e.response.data.error);
      }

      // Decrypt account payload and set the root key
      try {
        const rootKey = await account.decryptRootKey(
          this.password,
          encryptedAccount
        );
        account.setRootKey(rootKey);
      } catch (e) {
        return this.$toast.error(e);
      }

      // Direct to app home
      this.router.push("/app/");
    },
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    return {
      store,
      router,
    };
  },
});
</script>

<style scoped>
meter {
  /* Reset the default appearance */
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;

  margin: 0 auto 1em;
  width: 100%;
  height: 0.5em;

  /* Applicable only to Firefox */
  background: none;
  background-color: rgba(0, 0, 0, 0.1);
}

meter::-webkit-meter-bar {
  background: none;
  background-color: rgba(0, 0, 0, 0.1);
}

/* Webkit based browsers */
meter[value="1"]::-webkit-meter-optimum-value { background: #EF4444; }
meter[value="2"]::-webkit-meter-optimum-value { background: #FCD34D; }
meter[value="3"]::-webkit-meter-optimum-value { background: #6EE7B7; }
meter[value="4"]::-webkit-meter-optimum-value { background: #10B981; }

/* Gecko based browsers */
meter[value="1"]::-moz-meter-bar { background: #EF4444; }
meter[value="2"]::-moz-meter-bar { background: #FCD34D; }
meter[value="3"]::-moz-meter-bar { background: #6EE7B7; }
meter[value="4"]::-moz-meter-bar { background: #10B981; }
</style>