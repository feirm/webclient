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
          class="transition duration-300 ease-in-out px-3 py-2 w-36 text-sm border rounded-md focus:outline-none bg-orange-500 text-yellow-900 border-orange-500 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200"
        >
          <span v-if="!isLoading">Change Password</span>
          <img v-else class="mx-auto w-5" src="@/assets/loading_spinner.svg" />
        </button>
      </form>
    </div>
  </div>

  <!-- Success modal -->
  <SuccessModal
    :show="success.show"
    :message="success.message"
    @close="success.show = false"
  />

  <!-- Error modal -->
  <ErrorModal
    :show="error.show"
    :error="error.message"
    @close="error.show = false"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import SideNav from "@/components/account/SideNav.vue";
import SuccessModal from "@/components/modals/SuccessModal.vue";
import ErrorModal from "@/components/modals/ErrorModal.vue";

import authService from "@/service/api/authService";
import account from "@/class/account";

export default defineComponent({
  components: {
    SideNav,
    SuccessModal,
    ErrorModal,
  },
  setup() {
    const currentPassword = ref("");
    const newPassword = ref("");
    const confirmNewPassword = ref("");

    const success = ref({
      show: false,
      message: "",
    });

    const error = ref({
      show: false,
      message: "",
    });

    const isLoading = ref(false);

    // Change password
    const changePassword = async () => {
      // Check that the new passwords match...
      if (newPassword.value !== confirmNewPassword.value) {
        error.value.show = true;
        error.value.message = "New passwords do not match! Please try again.";

        return;
      }

      isLoading.value = true;

      // Fetch the users latest encrypted account
      const res = await authService.GetAccount();
      const encryptedAccount = res.data;

      // Decrypt the account fetched on mount to prove the user owns their password
      let rootKey;
      try {
        rootKey = await account.decryptRootKey(
          currentPassword.value,
          encryptedAccount
        );
      } catch (e) {
        error.value.show = true;
        error.value.message = e;

        isLoading.value = false;

        return;
      }

      // Fetch a password change token
      const response = await authService.ChangePasswordToken();
      const token = response.data;

      // Re-encrypt the root key with the new password
      const newRootKey = await account.generateEncryptedRootKey(
        rootKey,
        newPassword.value
      );

      // Sign the nonce which came with the change password token
      const identityKeypair = await account.deriveIdentityKeypair(rootKey);
      const signedNonce = await account.signMessage(
        identityKeypair,
        token.nonce
      );

      // Now that we have a new root key payload, and a signature of the token nonce, we can construct payload to send back to the change password endpoint.
      const payload = {
        encrypted_key: newRootKey,
        token_id: token.id,
        signature: signedNonce,
      };

      try {
        await authService.ChangePassword(payload);

        success.value.show = true;
        success.value.message =
          "Your Feirm account password has been changed! The next time you login, please remember to use your new password.";

        isLoading.value = false;

        return;
      } catch (e) {
        error.value.show = true;
        error.value.message = e.response.data;

        isLoading.value = false;

        return;
      }
    };

    return {
      isLoading,

      currentPassword,
      newPassword,
      confirmNewPassword,

      changePassword,

      success,
      error,
    };
  },
});
</script>
