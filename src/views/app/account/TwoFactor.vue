<template>
  <div class="flex p-4 space-x-4 justify-center">
    <div class="w-2/12">
      <SideNav />
    </div>
    <div class="container w-full md:w-2/5 border rounded-md p-4 space-y-3">
      <h1 class="text-3xl font-light">Two-Step Login</h1>
      <p>
        Your Feirm account is always secured with two-factor authentication.
      </p>

      <div
        class="relative px-4 py-3 leading-normal bg-gray-100 rounded-sm border-l-4 border-yellow-400 space-y-3"
      >
        <!-- Warning heading -->
        <div class="flex items-center text-yellow-400">
          <ExclamationIcon class="w-4 h-4 mr-2" />
          Warning!
        </div>

        <!-- Warning content -->
        <div class="space-y-3 leading-5 text-sm">
          <p>
            Due to the nature of two-step login, you could be locked out of your
            Feirm account if your two-factor authentication method was to fail.
            In this case, your recovery codes can be used to gain access to your
            account.
          </p>
          <p>
            Feirm support will not be able to assist you if you lose access to
            your account. We recommend you write down or print these recovery
            codes and keep them in a safe place.
          </p>
        </div>

        <!-- Warning footer -->
        <div>
          <button
            @click="getRecoveryCodes"
            class="px-3 py-2 w-44 transition duration-300 ease-in-out rounded-md text-sm font-medium bg-gray-50 border hover:bg-gray-200 focus:outline-none"
          >
            <span v-if="!fetchingRecoveryCodes">
              View recovery codes
            </span>
            <img
              v-else
              class="w-5 h-5 mx-auto"
              src="@/assets/loading_spinner_dark.svg"
              alt="Loading"
            />
          </button>
        </div>
      </div>

      <!-- 2FA providers -->
      <div class="pt-4 space-y-3">
        <h2 class="text-xl">Providers</h2>

        <div class="flex items-center w-full border p-4 rounded space-x-4">
          <div class="flex-shrink-0">
            <img src="@/assets/img/two-factor/authenticator_app.png" />
          </div>
          <div>
            <h1 class="font-medium">Authenticator App</h1>
            <p class="text-sm">
              Use an authenticator app (such as Google Authenticator or Authy)
              to generate time-based verification codes.
            </p>
          </div>
          <div>
            <button
              @click="showManageTotp = true"
              class="border px-2 py-1 transition duration-300 ease-in-out text-sm rounded-md hover:bg-gray-200 focus:outline-none"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      <TwoFactorRecoveryCodes
        v-if="showRecoveryCodes"
        :codes="recoveryCodes"
        @close="showRecoveryCodes = false"
      />

      <ManageTOTP :show="showManageTotp" @close="showManageTotp = false" />

      <ErrorAlert
        v-if="error.show"
        :heading="error.heading"
        :message="error.message"
        @close="closeErrorModal"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import ErrorAlert from "@/components/ErrorAlert.vue";
import SideNav from "@/components/account/SideNav.vue";
import TwoFactorRecoveryCodes from "@/components/account/TwoFactorRecoveryCodes.vue";
import ManageTOTP from "@/components/account/ManageTOTP.vue";

import { ExclamationIcon } from "@heroicons/vue/solid";
import authService from "@/service/api/authService";

export default defineComponent({
  components: {
    ErrorAlert,
    SideNav,
    TwoFactorRecoveryCodes,
    ManageTOTP,

    ExclamationIcon,
  },
  setup() {
    // Error handling
    interface ErrorPrompt {
      heading: string;
      message: string;
      show: boolean;
    }

    const error = ref({} as ErrorPrompt);

    // Trigger the error modal
    const triggerError = (heading, message: string, show: boolean) => {
      error.value.heading = heading;
      error.value.message = message;
      error.value.show = show;
    };

    // Close error modal
    const closeErrorModal = () => {
      error.value.show = false;
    };

    // Recovery codes
    const showRecoveryCodes = ref(false);
    const fetchingRecoveryCodes = ref(false);
    const recoveryCodes = ref();
    const secret = ref();

    const getRecoveryCodes = async () => {
      try {
        fetchingRecoveryCodes.value = true;

        const codes = await authService.GetRecoveryCodes();

        // Throw an error if there are no recovery codes
        if (codes.data.codes === null) {
          fetchingRecoveryCodes.value = false;

          triggerError(
            "No recovery codes found!",
            "It looks like there are no recovery codes on record for this account. This is likely due to your account using Email for two-factor authentication rather than a TOTP authenticator app. If you believe this is an error, please contact Feirm support.",
            true
          );

          return;
        }

        recoveryCodes.value = codes.data.codes;
        fetchingRecoveryCodes.value = false;
        showRecoveryCodes.value = true;
      } catch (e) {
        fetchingRecoveryCodes.value = false;
        triggerError("Unexpected error!", e, true);
      }
    };

    // Manage TOTP modal
    const showManageTotp = ref(false);

    return {
      error,
      triggerError,
      closeErrorModal,

      showRecoveryCodes,
      fetchingRecoveryCodes,
      getRecoveryCodes,
      recoveryCodes,

      showManageTotp,
      secret,
    };
  },
});
</script>
