<template>
  <!-- TODO: There is a bug with this component. It doesn't update when mounting again until a forced reload. -->
  <BaseModal :show="show">
    <div class="space-y-3">
      <h1 class="text-2xl text-center">Authenticator App</h1>
      <p>
        Follow these steps to setup two-step login with an authenticator app:
      </p>

      <!-- Steps -->
      <div class="text-sm">
        <div class="space-y-4">
          <p class="font-medium">1. Download an authenticator app</p>

          <!-- App recommendations -->
          <div class="space-y-1 ml-4">
            <p>
              iOS devices:
              <a class="text-blue-500" href="https://authy.com" target="_blank"
                >Authy</a
              >
            </p>
            <p>
              Android devices:
              <a class="text-blue-500" href="https://authy.com" target="_blank"
                >Authy</a
              >
            </p>
            <p>
              Windows devices:
              <a
                class="text-blue-500"
                href="https://www.microsoft.com/en-us/account/authenticator"
                target="_blank"
                >Microsoft Authenticator</a
              >
            </p>
          </div>

          <p>
            These are the recommended apps, however other authenticator apps
            will work too.
          </p>

          <p class="font-medium">
            2. Scan this QR code with your authenticator app
          </p>

          <div>
            <img class="mx-auto" :src="qrCode" alt="" />
            <div class="mx-auto border p-3 rounded text-center w-3/4">
              <p class="font-mono">
                {{ totpSecret }}
              </p>
            </div>
          </div>

          <p v-if="!totpEnabled" class="font-medium">
            3. Enter the 6-digit code being shown from your authenticator app
          </p>
          <input
            v-if="!totpEnabled"
            name="totp"
            v-model="token"
            type="number"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
      </div>

      <!-- Custom footer -->
      <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <!-- Show disable button if TOTP is enabled -->
        <button
          v-if="totpEnabled"
          @click="disableTotp"
          type="button"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-400 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
        >
          Disable
        </button>

        <button
          v-if="!totpEnabled"
          @click="enableTotp"
          type="button"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-400 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
        >
          Submit
        </button>

        <button
          @click="$emit('close')"
          type="button"
          class="w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium text-gray-900 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  </BaseModal>

  <!-- Success modal -->
  <BaseModal :show="totpSuccess" dismissFooter @dismiss="totpSuccess = false">
    <div class="space-y-3">
      <h1 class="text-2xl">Congratulations! 🥳</h1>
      <p>
        You've set up TOTP two-factor authentication for your Feirm account!
      </p>
    </div>
  </BaseModal>

  <!-- Successfully disabled modal -->
  <BaseModal
    :show="totpSuccessDisabled"
    dismissFooter
    @dismiss="totpSuccessDisabled = false"
  >
    <div class="space-y-3">
      <h1 class="text-2xl">TOTP Disabled!</h1>
      <p>
        Your account is back to using Email as the primary two-step login
        method. You can re-enable TOTP authentication at any time!
      </p>
    </div>
  </BaseModal>

  <!-- Error modal -->
  <BaseModal v-if="errorPresent" dismissFooter @dismiss="clearError">
    <div class="space-y-3">
      <h1 class="text-2xl">Error! 😟</h1>
      <p>
        {{ errorMessage }}
      </p>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import { authenticator } from "@otplib/preset-default";
import qrcode from "qrcode";
import authService from "@/service/api/authService";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    show: Boolean,
  },
  components: {
    BaseModal,
  },
  setup(props, { emit }) {
    const store = useStore();

    const errorPresent = ref(false);
    const errorMessage = ref("");

    const qrCode = ref();
    const totpSecret = ref();
    const totpEnabled = ref(false);
    const token = ref("");
    const totpSuccess = ref(false);
    const totpSuccessDisabled = ref(false);

    const randomSecret = authenticator.generateSecret(16);

    onMounted(async () => {
      // Lookup up the TOTP secret for the user or use the generated one if needed
      try {
        const recovery = await authService.GetRecoveryCodes();
        if (recovery.data.secret) {
          totpEnabled.value = true;
          totpSecret.value = recovery.data.secret;
        } else {
          totpSecret.value = randomSecret;
        }
      } catch (e) {
        // Handle this via a modal
        errorPresent.value = true;
        errorMessage.value = e;
      }

      // Generate scannable QR code
      const otpauth = authenticator.keyuri(
        store.getters.getUsername,
        "Feirm",
        totpSecret.value
      );

      qrCode.value = await qrcode.toDataURL(otpauth);
    });

    // Disabled TOTP for user
    const disableTotp = async () => {
      try {
        await authService.DisableTOTP();
        emit("close");
        totpSuccessDisabled.value = true;
      } catch (e) {
        errorPresent.value = true;
        errorMessage.value = e.response.data.error;
      }

      emit("close");
    };

    // Enable TOTP for user
    const enableTotp = async () => {
      try {
        await authService.EnableTOTP(randomSecret, token.value);
        emit("close");
        totpSuccess.value = true;
      } catch (e) {
        errorPresent.value = true;
        errorMessage.value = e.response.data.error;
      }
    };

    // Clear any error messages
    const clearError = () => {
      errorPresent.value = false;
      errorMessage.value = "";
    };

    return {
      clearError,
      errorPresent,
      errorMessage,

      totpSecret,
      qrCode,
      totpEnabled,
      token,
      totpSuccess,
      totpSuccessDisabled,

      enableTotp,
      disableTotp,
    };
  },
});
</script>
