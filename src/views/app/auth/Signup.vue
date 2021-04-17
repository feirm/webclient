<template>
  <div class="flex flex-row h-screen">
    <!-- Signup form -->
    <div
      class="flex flex-col justify-center bg-gradient-to-t from-grey-500 to-grey-900 p-6 md:p-12 w-full"
    >
      <div
        class="bg-white p-4 md:p-8 rounded shadow md:w-1/4 mx-auto"
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
            <!-- Username input -->
            <label class="block text-gray-900">Username</label>
            <input
              class="w-full border-2 border-gray-200 p-2 md:p-3 rounded outline-none focus:border-orange-500 transition duration-200"
              v-model="username"
              type="text"
              placeholder="Please pick a username"
              autofocus
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

          <button class="block w-full p-3 rounded shadow bg-orange-500 text-yellow-900">I agree</button>
          <router-link to="/" class="block w-full p-3 rounded shadow bg-red-400 text-red-900 text-center">I do not agree</router-link>
        </div>
      </div>
    </div>

    <!-- Two factor authentication modal setup -->
    <div
      v-if="showTwoFactorSetup"
      class="fixed overflow-x-hidden overflow-y-auto inset-0 z-50 p-8"
    >
      <div class="relative mx-auto w-2/6 max-w-2xl">
        <div
          class="flex flex-col bg-white rounded shadow-2xl w-full p-8 space-y-4"
        >
          <h1 class="text-light text-3xl text-center">
            Two Factor Authentication (2FA)
          </h1>
          <p>
            As an additional layer of security, the Feirm Platform enforces the
            use of two-factor authentication. This is used to protect your
            account from fraudulent access and to ensure that your encrypted
            data remains safe.
          </p>
          <p>
            To enable two-factor authentication, please scan the QR code below
            (or copy the secret code) into your authenticator app. We recommend
            <a
              class="text-blue-600"
              href="https://getaegis.app/"
              target="_blank"
              >Aegis Authenticator</a
            >
            for Android, or
            <a
              class="text-blue-600"
              href="https://www.tofuauth.com/"
              target="_blank"
              >Tofu</a
            >
            for iOS, but Google Authenticator or Authy will work fine too.
          </p>

          <hr />

          <!-- QR code and secret -->
          <img class="mx-auto" :src="totpSecretQr" alt="Secret QR Code" />
          <pre class="text-center">{{ totpSecret }}</pre>

          <hr />

          <form @submit.prevent="register" class="flex flex-col items-center">
            <p class="text-center mb-4">
              Please enter the six-digit code from your authenticator app.
            </p>
            <input
              class="w-32 border-2 border-gray-200 p-3 mb-4 rounded outline-none text-center focus:border-orange-500 transition duration-200"
              type="number"
              v-model="totpCode"
              autofocus
            />
            <button
              class="w-full mb-2 bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
              type="submit"
            >
              Submit
            </button>

            <!-- Cancel button -->
            <button
              class="w-full bg-gray-100 hover:bg-gray-200 p-4 rounded text-gray-900 transition duration-300"
              @click="showTwoFactorSetup = false"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
    <div
      v-if="showTwoFactorSetup"
      class="absolute inset-0 z-40 opacity-50 bg-black"
    ></div>
  </div>
</template>

<script lang="ts">
import authService from "@/service/api/authService";
import qrcode from "qrcode";
import { authenticator } from "otplib";
import zxcvbn from "zxcvbn";

import { defineComponent } from "vue";
import account from "@/class/account";
import { EncryptedAccount } from "@/models/account";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Signup",
  data() {
    return {
      step: 0,

      username: "",
      password: "",

      error: "",
      pwError: "",
      debounce: null,

      showTwoFactorSetup: false,
      totpSecret: "",
      totpSecretQr: "",
      totpCode: "",
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

      // Check if passwords are empty
      if (!this.password || !this.confirmPassword) {
        return this.$toast.error("Passwords cannot be empty!");
      }

      // Check if passwords match
      if (this.password != this.confirmPassword) {
        return this.$toast.error("Passwords do not match!");
      }

      // Generate secret and QR code
      const secret = authenticator.generateSecret(16);
      this.totpSecret = secret;

      const otpauth = authenticator.keyuri(this.username, "feirm.com", secret);
      this.totpSecretQr = await qrcode.toDataURL(otpauth);

      // Continue to disclaimer page
      this.step++;
    },
    async register() {
      // Generate an encrypted key using the password
      const key = await account.generateEncryptedRootKey(this.password);

      // Bundle it into an account object
      const encryptedAccount: EncryptedAccount = {
        username: this.username,
        encrypted_key: key,
        totp_secret: this.totpSecret,
        totp_code: this.totpCode,
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