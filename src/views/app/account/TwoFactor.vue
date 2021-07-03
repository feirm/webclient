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

        <div
          v-for="twoFactor in twoFactorMethods"
          :key="twoFactor.type"
          class="flex items-center w-full border p-4 rounded space-x-4"
        >
          <div class="flex-shrink-0">
            <img :src="twoFactor.icon" />
          </div>
          <div>
            <h1 class="font-medium">{{ twoFactor.type }}</h1>
            <p class="text-sm">
              {{ twoFactor.description }}
            </p>
          </div>
          <div>
            <button
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import SideNav from "@/components/account/SideNav.vue";
import TwoFactorRecoveryCodes from "@/components/account/TwoFactorRecoveryCodes.vue";

import { ExclamationIcon } from "@heroicons/vue/solid";
import authService from "@/service/api/authService";

// Supported two-factor authentication methods
const twoFactorMethods = [
  {
    type: "Authenticator App",
    description:
      "Use an authenticator app (such as Google Authenticator or Authy) to generate time-based verification codes.",
    icon: require("@/assets/img/two-factor/authenticator_app.png"),
  },
  {
    type: "Email Magic-Link",
    description:
      "Approve any new logins to your Feirm account using a magic-link sent to your email address. ",
    icon: require("@/assets/img/two-factor/email.png"),
  },
  /*
  {
    type: "FIDO2 (WebAuthn)",
    description:
      "Use a WebAuthn enabled security key (such as a YubiKey or SoloKey) to access your account.",
    icon: "https://vault.bitwarden.com/images/two-factor/7.png",
  },
  */
];

export default defineComponent({
  components: {
    SideNav,
    TwoFactorRecoveryCodes,

    ExclamationIcon,
  },
  setup() {
    const showRecoveryCodes = ref(false);
    const fetchingRecoveryCodes = ref(false);
    const recoveryCodes = ref();

    const getRecoveryCodes = async () => {
      try {
        fetchingRecoveryCodes.value = true;

        const codes = await authService.GetRecoveryCodes();
        if (codes.data.codes === null) {
          fetchingRecoveryCodes.value = false;
          return alert(
            "No recovery codes, enable two-factor provider other than email."
          );
        }

        recoveryCodes.value = codes.data.codes;
        fetchingRecoveryCodes.value = false;
        showRecoveryCodes.value = true;
      } catch (e) {
        fetchingRecoveryCodes.value = false;
        console.log(e);
      }
    };

    return {
      twoFactorMethods,

      showRecoveryCodes,
      fetchingRecoveryCodes,
      getRecoveryCodes,
      recoveryCodes,
    };
  },
});
</script>
