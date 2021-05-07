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
          <p class="text-sm mt-3">
            If you came from the original Feirm app, you will need to migrate
            your account to use the improved encryption methods in this version.
            You will be asked for your username, password and six-digit PIN.
            This won't take long!
          </p>
        </div>

        <div class="mt-8">
          <div class="mt-6">
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
        </div>
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

import tatsuyaService from "@/service/api/tatsuyaService";
import { ModeOfOperation, utils } from "aes-js";
import { ArgonType, hash } from "argon2-browser";
import hexToBytes from "@/helpers/hexToBytes";
import bufferToHex from "@/helpers/bufferToHex";
import account from "@/class/account";

export default defineComponent({
  name: "Migrate",
  data() {
    return {
      username: "",
      password: "",
      pin: "",
      submitted: false
    };
  },
  methods: {
    ...mapActions(["login", "setUsername"]),

    async migrateRequest() {
      // Set the submission state to true
      this.submitted = true;

      // Fetch account for the supplied username and PIN
      let oldAccount;
      try {
        await tatsuyaService
          .fetchEncryptedAccount(this.username, this.pin)
          .then(res => {
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
          hashLen: 32
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
      } catch (e) {
        this.submitted = false;
        return this.$toast.error(e);
      }

      // Derive an identity keypair to check if public keys match
      const keypair = await account.deriveIdentityKeypairLegacy(rootKey);
      const publicKey = bufferToHex(keypair.publicKey);

      if (oldAccount.rootPublicKey === publicKey) {
        return this.$toast.success("It's a match!");
      } else {
        return this.$toast.error("Please check your password and try again!");
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
