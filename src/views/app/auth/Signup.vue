<template>
  <div class="flex flex-row h-screen">
    <!-- Login form -->
    <div
      class="flex flex-col justify-center bg-gradient-to-t from-grey-500 to-grey-900 p-6 md:p-12 w-full"
    >
      <div class="bg-white p-4 md:p-8 rounded shadow md:w-1/4 mx-auto space-y-4">
        <img
          class="mx-auto w-16"
          src="@/assets/img/logo.webp"
          alt="Feirm Logo"
        />

        <h1 class="text-3xl md:text-4xl text-center text-orange font-light">
          Create your Feirm account!
        </h1>
        <p class="md:text-lg text-center text-gray-900">
          Welcome! Feirm is the all-in-one platform for your cryptocurrency
          needs. Getting started won't take long!
        </p>

        <form v-on:submit.prevent="checkUsername" class="space-y-3">
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

          <!-- Password input -->
          <label class="block text-gray-900">Password</label>
          <input
            class="w-full border-2 border-gray-200 p-2 md:p-3 rounded outline-none focus:border-orange-500 transition duration-200"
            v-model="password"
            type="password"
            placeholder="Please enter your password"
          />

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
        </form>
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

import { defineComponent } from "vue";
import account from "@/class/account";
import { EncryptedAccount } from "@/models/account";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Signup",
  data() {
    return {
      username: "",
      password: "",

      showTwoFactorSetup: false,
      totpSecret: "",
      totpSecretQr: "",
      totpCode: "",
    };
  },
  methods: {
    async usernameValid(username: string) {
      console.log(username);
    },
    async checkUsername() {
      // Check username to see if it exists
      try {
        await authService.CheckUsername(this.username);
      } catch (e) {
        return this.$toast.error(e.response.data.error);
      }

      // TODO: Check password and it's strength

      // Generate secret and QR code
      const secret = authenticator.generateSecret(16);
      this.totpSecret = secret;

      const otpauth = authenticator.keyuri(this.username, "feirm.com", secret);
      this.totpSecretQr = await qrcode.toDataURL(otpauth);

      // Open up TOTP prompt
      this.showTwoFactorSetup = true;
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
