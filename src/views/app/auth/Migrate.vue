<template>
  <div class="min-h-screen bg-white flex">
    <div
      class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96 space-y-6">
        <div>
          <img
            class="h-12 w-auto mx-auto"
            src="@/assets/img/logo.webp"
            alt="Feirm"
          />
          <h2 class="mt-6 text-3xl font-light text-gray-900 text-center">
            Migrate your <span class="text-orange">Feirm</span> account
          </h2>

          <p v-if="step === 0" class="text-sm mt-3">
            If you came from the original Feirm app, you will need to migrate
            your account to use the improved encryption methods in this version.
            You will be asked for your username, password and six-digit PIN.
            This won't take long!
          </p>

          <p v-if="step === 1" class="text-sm mt-3">
            Hooray, we've been able to get the data we need. To finish things
            off we need a preferred username, email address (optional) and
            password.
          </p>
        </div>

        <div class="mt-8">
          <div v-if="step === 0" class="mt-6">
            <form @submit.prevent="migrateRequest" class="space-y-6">
              <div>
                <label
                  for="username"
                  class="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div class="mt-1">
                  <input
                    name="username"
                    type="text"
                    v-model="username"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div class="mt-1">
                  <input
                    name="password"
                    type="password"
                    v-model="password"
                    autocomplete="current-password"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  PIN
                </label>
                <div class="mt-1">
                  <input
                    name="pin"
                    type="password"
                    v-model="pin"
                    autocomplete="current-password"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              <div class="text-sm text-center">
                <router-link
                  to="/app/signup"
                  class="font-medium text-gray-600 hover:text-gray-900"
                >
                  Want to start fresh? Create a new account.
                </router-link>
              </div>

              <div>
                <button
                  :disabled="submitted"
                  type="submit"
                  class="w-full flex disabled:opacity-50 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-900 bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <span v-if="!submitted">Start migration</span>
                  <img
                    v-else
                    class="mx-auto w-5"
                    src="@/assets/loading_spinner.svg"
                  />
                </button>
              </div>
            </form>
          </div>

          <!-- New account details -->
          <div v-if="step === 1" class="mt-6">
            <form @submit.prevent="checkForm" class="space-y-6">
              <div>
                <label
                  for="username"
                  class="block text-sm font-medium text-gray-700"
                >
                  Preferred username
                </label>
                <div class="mt-1">
                  <input
                    name="username"
                    type="text"
                    v-model="username"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email address (optional)
                </label>
                <div class="mt-1">
                  <input
                    name="email"
                    type="email"
                    v-model="email"
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div class="mt-1">
                  <input
                    name="password"
                    type="password"
                    v-model="newPassword"
                    autocomplete="current-password"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Confirm password
                </label>
                <div class="mt-1">
                  <input
                    name="password"
                    type="password"
                    v-model="newConfirmPassword"
                    autocomplete="current-password"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              <div class="text-sm text-center">
                <router-link
                  to="/app/signup"
                  class="font-medium text-gray-600 hover:text-gray-900"
                >
                  Want to start fresh? Create a new account.
                </router-link>
              </div>

              <div>
                <button
                  :disabled="submitted"
                  type="submit"
                  class="w-full flex disabled:opacity-50 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-900 bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <span v-if="!submitted">Submit</span>
                  <img
                    v-else
                    class="mx-auto w-5"
                    src="@/assets/loading_spinner.svg"
                  />
                </button>
              </div>
            </form>
          </div>

          <!-- TOTP setup -->
          <div class="mt-6 space-y-3" v-if="step === 2">
            <p>
              You have chosen to create your Feirm account with a username only.
              To protect your account, you need to setup TOTP. Please scan the
              QR code or manually enter the secret below into your authenticator
              app.
            </p>
            <img class="mx-auto" :src="totpSecretQr" />

            <div
              class="border-2 border-gray-200 rounded text-sm p-2 w-3/4 text-center mx-auto"
            >
              <code>{{ totp.secret }}</code>
            </div>

            <div class="space-y-3">
              <label for="totp" class="block text-sm font-medium text-gray-700">
                TOTP Token
              </label>
              <input
                name="totp"
                type="text"
                v-model="totp.token"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>

            <button
              :disabled="submitted"
              @click="register"
              class="w-full flex disabled:opacity-50 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-900 bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <span v-if="!submitted">Submit</span>
              <img
                v-else
                class="mx-auto w-5"
                src="@/assets/loading_spinner.svg"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden lg:block relative w-0 flex-1">
      <img
        class="absolute inset-0 h-full w-full object-cover"
        src="@/assets/lava3.jpg"
        alt=""
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, useStore } from "vuex";
import { useRouter } from "vue-router";

import tatsuyaService from "@/service/api/tatsuyaService";
import { ModeOfOperation, utils } from "aes-js";
import { ArgonType, hash } from "argon2-browser";
import hexToBytes from "@/helpers/hexToBytes";
import bufferToHex from "@/helpers/bufferToHex";
import account from "@/class/account";

import qrcode from "qrcode";
import { authenticator } from "@otplib/preset-default";
import authService from "@/service/api/authService";
import { EncryptedAccount } from "@/models/account";

export default defineComponent({
  name: "Migrate",
  data() {
    return {
      username: "",
      password: "",
      pin: "",

      rootKey: "",

      email: "",
      newPassword: "",
      newConfirmPassword: "",

      totpSecretQr: "",
      totp: {
        secret: "",
        token: "",
      },

      submitted: false,
      step: 0,
    };
  },
  methods: {
    ...mapActions(["login"]),

    async migrateRequest() {
      // Set the submission state to true
      this.submitted = true;

      // Fetch account for the supplied username and PIN
      let oldAccount;
      try {
        await tatsuyaService
          .fetchEncryptedAccount(this.username, this.pin)
          .then((res) => {
            oldAccount = res.data;
            this.submitted = false;
          });
      } catch (e) {
        this.submitted = false;
        return this.$toast.error(e.response.data.error);
      }

      // Reconstruct the encryption key used to encrypt the root key
      let encryptionKey;
      try {
        const secretKey = await hash({
          pass: this.password,
          salt: hexToBytes(oldAccount.rootPasswordSalt),
          type: ArgonType.Argon2id,
          hashLen: 32,
        });

        encryptionKey = secretKey.hash;
      } catch (e) {
        this.submitted = false;
        return this.$toast.error(e);
      }

      // Attempt to decrypt the root key
      let rootKey;
      try {
        const salt = utils.hex
          .toBytes(oldAccount.encryptedRootKey.iv)
          .slice(0, 16);
        const aesCbc = new ModeOfOperation.cbc(encryptionKey, salt);

        rootKey = aesCbc.decrypt(
          utils.hex.toBytes(oldAccount.encryptedRootKey.cipherText)
        );

        this.rootKey = bufferToHex(rootKey);
      } catch (e) {
        this.submitted = false;
        return this.$toast.error(e);
      }

      // Derive an identity keypair to check if public keys match
      const keypair = await account.deriveIdentityKeypairLegacy(rootKey);
      const publicKey = bufferToHex(keypair.publicKey);

      if (oldAccount.rootPublicKey !== publicKey) {
        return this.$toast.error("Please check your password and try again!");
      }

      // Proceed to next step
      this.step++;
    },

    async checkForm() {
      // Check if username is empty
      if (!this.username) {
        return this.$toast.error("Username cannot be empty!");
      }

      // Check if passwords are empty
      if (!this.newPassword || !this.newConfirmPassword) {
        return this.$toast.error("Passwords cannot be empty!");
      }

      // Check if passwords match
      if (this.newPassword != this.newConfirmPassword) {
        return this.$toast.error("Passwords do not match!");
      }

      // Check if username valid
      this.submitted = true;
      try {
        this.submitted = false;
        await authService.CheckUsername(this.username);
      } catch (e) {
        this.submitted = false;
        return this.$toast.error(e.response.data.error);
      }

      // Determine if an email address is present and if not, navigate to TOTP setup
      if (this.email == "") {
        // Generate TOTP secret
        const secret = authenticator.generateSecret(16);
        this.totp.secret = secret;

        // Generate scannable QR code
        const otpauth = authenticator.keyuri(this.username, "Feirm", secret);
        this.totpSecretQr = await qrcode.toDataURL(otpauth);

        console.log(this.totp);

        return (this.step = 2);
      }

      // Othwerise register
      await this.register();
    },

    async register() {
      this.submitted = true;

      // Generate a root key and encrypt it
      const rootKey = account.generateRootKey();
      const encryptedKey = await account.generateEncryptedRootKey(
        rootKey,
        this.password
      );

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
          signature: signature,
        },
        totp: this.totp,
      };

      // Submit account object to API
      try {
        const res = await authService.CreateAccount(encryptedAccount);

        // Extract tokens
        const accessToken = res.data.access_token;

        // Set refresh and access token
        this.login(accessToken);
      } catch (e) {
        this.submitted = false;
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
        this.submitted = false;
        return this.$toast.error(e);
      }

      // Fetch and set username in Vuex
      try {
        await authService.GetAccount().then((res) => {
          const username = res.data.username;
          this.store.dispatch("setUsername", username);
        });
      } catch (e) {
        this.submitted = false;
        return this.$toast.error(e.response.data.error);
      }

      // Direct to app home
      this.submitted = false;
      this.router.push("/app/");
    },
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    return {
      router,
      store,
    };
  },
});
</script>
