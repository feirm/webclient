<template>
  <div class="flex p-4 space-x-4 justify-center">
    <div class="w-2/12">
      <SideNav />
    </div>
    <div class="container w-full md:w-2/5 border rounded-md p-4 space-y-3">
      <h1 class="text-3xl font-light">My Account</h1>

      <!-- Danger Zone -->
      <danger-zone />
    </div>
  </div>
</template>

<script lang="ts">
import authService from "@/service/api/authService";
import { defineComponent } from "vue";
import { authenticator } from "otplib";
import qrcode from "qrcode";

import { mapGetters } from "vuex";
import { useRouter } from "vue-router";
import account from "@/class/account";
import bufferToHex from "@/helpers/bufferToHex";

import DangerZone from "@/components/account/DangerZone.vue";
import SideNav from "@/components/account/SideNav.vue";

import walletService from "@/service/api/walletService";

export default defineComponent({
  data() {
    return {
      showModal: false,
      showDeviceSecurityModal: false,

      hasRootKey: false,
      hasWallet: false,
      profile: {},
    };
  },
  components: {
    DangerZone,
    SideNav,
  },
  computed: {
    ...mapGetters(["getUsername"]),
  },
  async mounted() {
    // Check LocalStorage for Root Key
    const rootKey = localStorage.getItem("rootKey");
    if (rootKey) {
      this.hasRootKey = true;
    }

    // Fetch account data
    await authService.GetAccount().then((res) => {
      this.profile = res.data;
    });

    // Determine is account has a wallet
    const wallet = await walletService.GetWallet();
    if (wallet.data == null) {
      this.hasWallet = false;
    } else {
      this.hasWallet = true;
    }
  },
  methods: {
    async verifyEmail() {
      // Resend an email confirmation to the user
      try {
        await authService.ResendEmailVerification();
        return this.$toast.success(
          "Please check your email and verify your account."
        );
      } catch (e) {
        return this.$toast.error(e.response.data.error);
      }
    },

    // Based on the method used, return a pretty string
    determineTwoFactor(method: string) {
      if (method === "email") {
        return "Email magic-link";
      } else if (method === "totp") {
        return "TOTP";
      } else {
        return "Unknown";
      }
    },

    // Reset two factor modal
    closeModal() {
      this.showModal = false;
      this.changeTwoFactor.selected = "";
      this.changeTwoFactor.step = 0;
    },

    // Determine next step based on two-factor method chosen
    async nextStep() {
      // If the profile says TOTP is their two factor method,
      // but they have selected email, disable TOTP
      if (
        this.profile.two_factor_method === "totp" &&
        this.changeTwoFactor.selected === "email"
      ) {
        try {
          await authService.DisableTOTP();
        } catch (e) {
          return this.$toast.error(e.response.data.error);
        }

        // Fetch updated profile data and close modal
        await authService.GetAccount().then((res) => {
          this.profile = res.data;
        });

        this.closeModal();
      }

      // Go to TOTP enable screen
      if (this.changeTwoFactor.selected === "totp") {
        // Generate TOTP secret
        const secret = authenticator.generateSecret(16);
        this.totp.secret = secret;

        // Generate scannable QR code
        const otpauth = authenticator.keyuri(this.getUsername, "Feirm", secret);
        this.totp.qrCode = await qrcode.toDataURL(otpauth);

        this.changeTwoFactor.step = 1;
      }
    },

    // Submit TOTP secret data
    async submitTotp() {
      try {
        await authService.EnableTOTP(this.totp.secret, this.totp.token);
      } catch (e) {
        return this.$toast.error(e.response.data.error);
      }

      // Set recovery codes
      try {
        const res = await authService.GetRecoveryCodes();
        this.recoveryCodes = res.data.codes;
      } catch (e) {
        return this.$toast.error(e.response.data.error);
      }

      // Change to recovery codes step
      this.changeTwoFactor.step = 2;
    },

    // User has confirmed they've written down their recovery codes, so fetch and update profile data
    async confirmRecovery() {
      await authService.GetAccount().then((res) => {
        this.profile = res.data;
      });

      this.closeModal();
    },

    saveRootKey() {
      const rootKey = account.getRootKey();
      localStorage.setItem("rootKey", bufferToHex(rootKey));

      this.showDeviceSecurityModal = false;
      this.hasRootKey = true;
    },

    deleteRootKey() {
      localStorage.removeItem("rootKey");
      this.hasRootKey = false;
    },
  },
  setup() {
    const router = useRouter();

    return {
      router,
    };
  },
});
</script>
