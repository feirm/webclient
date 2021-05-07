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
            Sign in to your <span class="text-orange">Feirm</span> account
          </h2>
        </div>

        <div class="mt-8">
          <div class="mt-6">
            <form @submit.prevent="loginRequest" class="space-y-6">
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

              <TransitionRoot
                :show="totpEnabled"
                enter="transition-opacity duration-750"
                enter-from="opacity-0"
                enter-to="opacity-100"
              >
                <div class="space-y-1">
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700"
                  >
                    TOTP Token
                  </label>
                  <div class="mt-1">
                    <input
                      name="totp"
                      type="text"
                      v-model="totp"
                      autocomplete="current-password"
                      required
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    />
                  </div>
                </div>
              </TransitionRoot>

              <div class="text-sm text-center">
                <router-link
                  to="/app/signup"
                  class="font-medium text-gray-600 hover:text-gray-900"
                >
                  Don't have an account? Sign up.
                </router-link>
              </div>

              <div>
                <button
                  :disabled="submitted"
                  type="submit"
                  class="w-full flex disabled:opacity-50 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-900 bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <span v-if="!submitted">Sign in</span>
                  <img
                    v-else
                    class="mx-auto w-5"
                    src="@/assets/loading_spinner.svg"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Only show if user needs to check their email -->
        <TransitionRoot
          :show="checkEmail"
          enter="transition-opacity duration-1000"
          enter-from="opacity-0"
          enter-to="opacity-100"
        >
          <div class="bg-green-100 text-center text-gray-900 p-3 rounded">
            <p>
              Please check your email and approve the login request for your
              account. Keep this page open.
            </p>
          </div>
        </TransitionRoot>
      </div>
    </div>
    <div class="hidden lg:block relative w-0 flex-1">
      <img
        class="absolute inset-0 h-full w-full object-cover"
        src="@/assets/lava.jpg"
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

import { TransitionRoot } from "@headlessui/vue";

export default defineComponent({
  name: "Login",
  components: {
    TransitionRoot
  },
  data() {
    return {
      username: "",
      password: "",
      totp: "",

      totpEnabled: false,

      checkEmail: false,
      submitted: false
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
            return;
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
          const res = await authService.CreateLoginRequestTOTP(
            this.username,
            this.totp
          );
          encryptedAccount = res.data;
        } catch (e) {
          this.submitted = false;
          return this.$toast.error(e.response.data.error);
        }

        // Attempt to decrypt the root key
        const rootKey = await account
          .decryptRootKey(this.password, encryptedAccount)
          .catch(() => {
            this.submitted = false;
            this.checkEmail = false;

            return this.$toast.error(
              "There was an error decrypting your account! Please try again!"
            );
          });

        // Derive the identity keypair and sign the token nonce
        const keypair = await account.deriveIdentityKeypair(rootKey);
        const signature = await account.signMessage(
          keypair,
          encryptedAccount.token?.nonce as string
        );

        // Send the token ID and signature back to the auth API to create a session
        try {
          const res = await authService.CreateLoginSession(
            this.username,
            encryptedAccount.token?.id as string,
            signature
          );

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
            const rootKey = await account
              .decryptRootKey(this.password, encryptedAccount)
              .catch(() => {
                this.submitted = false;
                this.checkEmail = false;

                return this.$toast.error(
                  "There was an error decrypting your account! Please try again!"
                );
              });

            // Derive identity keypair and sign the token nonce
            const keypair = await account.deriveIdentityKeypair(rootKey);
            const signature = await account.signMessage(
              keypair,
              encryptedAccount.token?.nonce as string
            );

            // Send to API
            const tokenRes = await authService
              .CreateLoginSession(
                this.username,
                encryptedAccount.token?.id as string,
                signature
              )
              .catch(e => {
                this.submitted = false;
                this.checkEmail = false;

                return this.$toast.error(e.response.data.error);
              });

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
