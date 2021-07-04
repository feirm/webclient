<template>
  <BaseModal :show="show" dismissFooter>
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

          <img class="mx-auto" :src="qrCode" alt="" />
          <div class="mx-auto border p-3 rounded text-center w-3/4">
            <p class="font-mono">
              {{ totpSecret }}
            </p>
          </div>

          <p class="font-medium">
            3. Enter the 6-digit code being shown from your authenticator app
          </p>
          <input
            name="totp"
            type="number"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import { authenticator } from "@otplib/preset-default";
import qrcode from "qrcode";

export default defineComponent({
  props: {
    show: Boolean,
    username: String,
    secret: String,
  },
  components: {
    BaseModal,
  },
  setup(props, { emit }) {
    const qrCode = ref();
    const totpSecret = ref();

    onMounted(async () => {
      // Generate a QR secret if one wasn't provided through props
      if (!props.secret) {
        totpSecret.value = authenticator.generateSecret(16);
      }

      // Generate scannable QR code
      const otpauth = authenticator.keyuri(
        props.username,
        "Feirm",
        props.secret ? props.secret : totpSecret.value
      );
      qrCode.value = await qrcode.toDataURL(otpauth);
    });

    // Handle close
    const closeEvent = () => {
      emit("close");
    };

    return {
      props,
      totpSecret,
      qrCode,
      closeEvent,
    };
  },
});
</script>
