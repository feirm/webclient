<template>
  <div class="flex min-h-screen items-center justify-center bg-grey-500">
    <div
      class="bg-gray-100 p-8 shadow-2xl sm:w-1/2 md:w-1/2 lg:w-1/4 sm:rounded md:rounded lg:rounded sm:h-full md:h-full lg:h-full"
    >
      <router-link to="/">
        <img
          class="mx-auto w-16 mb-5"
          src="@/assets/img/logo.webp"
          alt="Feirm Logo"
        />
      </router-link>

      <h1 class="text-3xl font-light mb-4 text-center">
        Unlock your account 🔒
      </h1>
      <p class="font-light mb-3">
        Please enter your encryption key to unlock your Feirm account.
      </p>

      <!-- Encryption key input -->
      <label class="block mb-2 font-light text-gray-500">Encryption Key</label>
      <input
        class="w-full mb-3 border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200"
        v-model="encryptionKey"
        type="password"
        autofocus
      />

      <!-- Decrypt button -->
      <button
        class="block w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
        @click="decrypt()"
      >
        <p v-if="!decrypting">Unlock</p>
        <img
          v-else
          class="mx-auto w-6"
          src="@/assets/loading_spinner.svg"
          alt="Loading spinner"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import account from "@/class/account";
import { defineComponent } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { mapGetters, useStore } from "vuex";

export default defineComponent({
  name: "Unlock",
  data() {
    return {
      encryptionKey: "",
      decrypting: false
    };
  },
  computed: {
    ...mapGetters(["getRefreshToken"])
  },
  methods: {
    async decrypt() {
      this.decrypting = true;

      try {
        // Fetch encrypted account from IDB
        const encryptedAccount = await account.fetchAccount();

        // Decrypt using encryption key
        const rootKey = await account.decryptRootKey(
          this.encryptionKey,
          encryptedAccount
        );
        account.setRootKey(rootKey);
      } catch (e) {
        this.decrypting = false;
        return this.$toast.error("Failed to unlock your account!");
      }

      try {
        console.log("Hello")
      } catch (e) {
        console.log(e);

        this.decrypting = false;
        return this.$toast.error("Unable to fetch access token!");
      }

      this.decrypting = false;
      this.router.push("/app");
    }
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    return {
      store,
      router
    };
  }
});
</script>
