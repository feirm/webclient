<template>
  <div class="flex p-4 space-x-4 justify-center">
    <div class="w-2/12">
      <SideNav />
    </div>
    <div class="container w-full md:w-2/5 border rounded-md p-4 space-y-3">
      <h1 class="text-3xl font-light">My Account</h1>

      <!-- Account details -->
      <div class="border p-4 rounded-md space-y-2">
        <img
          v-if="isLoading"
          class="w-5 h-5"
          src="@/assets/loading_spinner_dark.svg"
          alt="Loading..."
        />

        <div v-else>
          <p>Username: {{ profile.username }}</p>
          <p>Email Address: {{ profile.email }}</p>
          <p>Member Since: {{ profile.created_at }}</p>
        </div>
      </div>

      <!-- Danger Zone -->
      <danger-zone />
    </div>
  </div>
</template>

<script lang="ts">
import authService from "@/service/api/authService";
import { defineComponent, onMounted, ref } from "vue";

import { useRouter } from "vue-router";
import account from "@/class/account";
import bufferToHex from "@/helpers/bufferToHex";
import { DateTime } from "luxon";

import DangerZone from "@/components/account/DangerZone.vue";
import SideNav from "@/components/account/SideNav.vue";

export default defineComponent({
  components: {
    DangerZone,
    SideNav,
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
    const profile = ref({} as any);
    const isLoading = ref(true);

    onMounted(async () => {
      // Fetch account data
      await authService.GetAccount().then((res) => {
        profile.value = res.data;
        isLoading.value = false;
      });

      // Calculate account creation date
      profile.value.created_at = DateTime.fromSeconds(
        profile.value.created_at
      ).toHTTP();
    });

    return {
      router,

      profile,
      isLoading,
    };
  },
});
</script>
