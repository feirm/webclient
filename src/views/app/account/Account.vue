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

import { mapGetters } from "vuex";
import { useRouter } from "vue-router";
import account from "@/class/account";
import bufferToHex from "@/helpers/bufferToHex";

import DangerZone from "@/components/account/DangerZone.vue";
import SideNav from "@/components/account/SideNav.vue";

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
    // Fetch account data
    await authService.GetAccount().then((res) => {
      this.profile = res.data;
    });
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

    // Reset two factor modal
    closeModal() {
      this.showModal = false;
      this.changeTwoFactor.selected = "";
      this.changeTwoFactor.step = 0;
    },

    // Save root key to localStorage
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
