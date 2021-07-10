<template>
  <div class="flex p-4 space-x-4 justify-center">
    <div class="w-2/12">
      <SideNav />
    </div>

    <div class="container w-full md:w-2/5 border rounded-md p-4 space-y-3">
      <h1 class="text-3xl font-light">Change your Password</h1>
      <p>
        Changing your Feirm account password involves your web browser
        re-encrypting your private key. This is done using
        <b>AES256-CBC</b> with an <b>Argon2</b> stretched version of your
        password.
      </p>

      <!-- Change password form -->
      <form class="space-y-4" @submit.prevent="changePassword">
        <!-- Current password -->
        <label for="username" class="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <input
          name="currentPassword"
          type="password"
          v-model="currentPassword"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        />

        <!-- New password -->
        <label for="username" class="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          name="newPassword"
          type="password"
          v-model="newPassword"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        />

        <!-- Confirm new password -->
        <label for="username" class="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          name="confirmNewPassword"
          type="password"
          v-model="confirmNewPassword"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        />

        <div
          class="relative px-4 py-3 leading-normal bg-gray-100 rounded-sm border-l-4 border-yellow-400 space-y-3"
        >
          <!-- Warning content -->
          <div class="space-y-3 leading-5 text-sm">
            <p>
              Your new password will be used to encrypt your Feirm account
              private key. It is <i>extremely</i> important to store this
              password safely, as it cannot be recovered if you can't remember
              it.
            </p>
            <p>
              There is absolutely no way for Feirm to recover a lost password
              due to the nature of client-side encryption used throughout the
              platform.
            </p>
          </div>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          class="transition duration-300 ease-in-out px-3 py-2 text-sm border rounded-md focus:outline-none bg-orange-500 text-yellow-900 border-orange-500 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200"
        >
          Change Password
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import SideNav from "@/components/account/SideNav.vue";
import { EncryptedAccount } from "@/models/account";
import authService from "@/service/api/authService";
import account from "@/class/account";

export default defineComponent({
  components: {
    SideNav,
  },
  setup() {
    const encryptedAccount = ref({} as EncryptedAccount);

    const currentPassword = ref("");
    const newPassword = ref("");
    const confirmNewPassword = ref("");

    onMounted(async () => {
      try {
        const response = await authService.GetAccount();
        encryptedAccount.value = response.data;
      } catch (e) {
        console.log("[Change Password]", e.response.data);
      }
    });

    // Check that the new passwords match
    const checkPassword = () => {
      if (newPassword.value !== confirmNewPassword.value) {
        alert("New passwords do not match!");
      }
    };

    // Change password
    const changePassword = async () => {
      // Decrypt the account fetched on mount
      try {
        const rootKey = await account.decryptRootKey(
          currentPassword.value,
          encryptedAccount.value
        );
      } catch (e) {
        // Handle later
        // console.log("[Change Password]", e);
      }
    };

    return {
      currentPassword,
      newPassword,
      confirmNewPassword,

      changePassword,
    };
  },
});
</script>
