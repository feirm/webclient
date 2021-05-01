<template>
  <div class="min-h-screen bg-white flex">
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96 space-y-6">
        <div>
          <img class="h-12 w-auto mx-auto" src="@/assets/img/logo.webp" alt="Feirm" />
          <h2 class="mt-6 text-3xl font-light text-gray-900 text-center">
            Create your <span class="text-orange">Feirm</span> account
          </h2>
        </div>

        <div class="mt-8">
          <div class="mt-6">
            <form @submit.prevent="register" class="space-y-6">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div class="mt-1">
                  <input name="email" type="email" v-model="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label for="username" class="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div class="mt-1">
                  <input name="username" type="text" v-model="username" required v-on:input="usernameValid($event.target.value)" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                </div>

                <TransitionRoot :show="error !== ''" class="pt-3" enter="transition-opacity duration-1000" enter-from="opacity-0" enter-to="opacity-100">
                  <p class="text-red-400">{{ error }}</p>
                </TransitionRoot>
              </div>

              <div class="space-y-1">
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div class="mt-1">
                  <input name="password" type="password" v-model="password" v-on:input="checkPassword" autocomplete="current-password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                </div>
                <meter max="4" id="password-strength-meter"></meter>
                <p class="text-grey-400 text-center" v-if="pwError">{{ pwError }}</p>
              </div>

              <div class="space-y-1">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <div class="mt-1">
                  <input name="confirmPassword" type="password" v-model="confirmPassword" autocomplete="current-password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                </div>
              </div>

              <div class="text-sm text-center">
                <router-link to="/app/login" class="font-medium text-gray-600 hover:text-gray-900">
                  Already have an account? Sign in.
                </router-link>
              </div>

              <div>
                <button :disabled="submitted" type="submit" class="w-full flex disabled:opacity-50 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-900 bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                  <span v-if="!submitted">Sign up</span>
                  <img v-else class="mx-auto w-5" src="@/assets/loading_spinner.svg" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden lg:block relative w-0 flex-1">
      <img class="absolute inset-0 h-full w-full object-cover" src="@/assets/lava2.jpg" alt="" />
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

import { TransitionRoot } from "@headlessui/vue";

export default defineComponent({
  name: "Signup",
  components: {
    TransitionRoot
  },
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
    async register() {
      // Check if email is empty
      if (!this.email) {
        return this.$toast.error("Email address cannot be empty!");
      }

      // Check if username is empty
      if (!this.username) {
        return this.$toast.error("Username cannot be empty!");
      }

      // Check if email valid
      try {
        await authService.CheckEmail(this.email);
      } catch (e) {
        return this.$toast.error(e.response.data.error);
      }

      // Check if username valid
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

      // Generate a root key and encrypt it
      const rootKey = account.generateRootKey();
      const encryptedKey = await account.generateEncryptedRootKey(rootKey, this.password);

      // Derive identity keypair
      const keypair = await account.deriveIdentityKeypair(rootKey);

      // Fetch ephemeral token to sign
      const token = await authService.GetRegisterToken();
      const signature = await account.signMessage(keypair, token.data.nonce);

      // Bundle it into an account object
      const encryptedAccount: EncryptedAccount = {
        email: this.email,
        username: this.username,
        identity_publickey: bufferToHex(keypair.getPublic()),
        encrypted_key: encryptedKey,
        token: {
          id: token.data.id,
          signature: signature
        }
      };

      // Submit account object to API
      try {
        const res = await authService.CreateAccount(encryptedAccount);

        // Extract tokens
        const accessToken = res.data.access_token;

        // Set refresh and access token
        this.store.dispatch("login", accessToken);
      } catch (e) {
        return this.$toast.error(e.response.data.error);
      }

      // Decrypt account payload and set the root key
      try {
        const rootKey = await account.decryptRootKey(this.password, encryptedAccount);
        account.setRootKey(rootKey);
      } catch (e) {
        return this.$toast.error(e);
      }

      // Fetch and set username in Vuex
      try {
        await authService.GetAccount().then(res => {
          const username = res.data.username;
          this.store.dispatch("setUsername", username);
        })
      } catch (e) {
        return this.$toast.error(e.response.data.error);
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