<template>
  <div class="flex justify-center items-center m-6 md:m-24">
    <div class="container w-4/5 md:w-2/5 rounded-lg p-12 shadow-sm bg-gray-100 mb-3">
      <h1 class="text-2xl text-center font-semibold md:text-3xl text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600">
        Feirm
      </h1>
      <p class="text-gray-900 text-lg text-center">Your private and secure non-custodial wallet.</p>

      <form @submit.prevent="submitAccount" class="mt-6 mb-6 w-3/5 mx-auto space-y-3">
        <!-- Error alert -->
        <div v-if="error.show" class="bg-red-100 p-3 rounded-lg">
          <p class="text-red-400 text-center">{{ error.message }}</p>
        </div>

        <div v-if="!otpEnabled && loading" class="bg-green-100 p-3 rounded-lg">
          <p class="text-green-600 text-center">Check your email and approve the login.</p>
        </div>

        <!-- Username -->
        <div class="relative mt-1">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
           <UserIcon class="w-5 h-5 text-gray-600" />
          </div>
          <input type="text" v-model="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="Username" required>
        </div>

        <!-- Password -->
        <div class="relative mt-1">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
           <LockClosedIcon class="w-5 h-5 text-gray-600" />
          </div>
          <input type="password" v-model="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="●●●●●●●●" required>
        </div>

        <!-- OTP -->
        <div v-if="otpEnabled">
          <label for="otp" class="block text-sm font-medium text-gray-900">OTP</label>
          <div class="relative mt-1">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <ClockIcon class="w-5 h-5 text-gray-600" />
            </div>
            <input type="number" id="otp" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="Six-digit OTP">
          </div>
        </div>
      
        <b-button type="submit" class="w-full" :loading="loading">Log in</b-button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import account from "@/class/account";
import { EncryptedAccount } from "@/models/account";
import authService from "@/service/api/authService";
import { UserIcon, LockClosedIcon, ClockIcon } from "@heroicons/vue/solid";
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";

const store = useStore();

// Form fields
const username = ref();
const password = ref();
const otp = ref();

// Authentication
const loginReqId = ref();
const otpEnabled = ref(false) // always assume to start with that otp is not enabled

const loading = ref(false);
const error = ref({
  message: "",
  show: false
});

// Create a login request for user
const submitAccount = async () => {
  error.value.show = false;
  error.value.message = "";

  loading.value = true

  // Send off for a generic login request first. If we get back a TOTP response then we handle that accordingly
  if (!otpEnabled.value) {
    try {
      const res = await authService.CreateLoginRequest(username.value);
      if (res.data.totp) {
        otpEnabled.value = true;
      }

      // Set the login request ID if available
      if (res.data.id) {
        loginReqId.value = res.data.id;
      }

    } catch (e) {
      error.value.message = e.response.data.error;
      error.value.show = true;

      loading.value = false;
    }

    // Create an interval to monitor the login request token
    const interval = setInterval(async () => {
      try {
        const res = await authService.LoginRequestStatus(loginReqId.value);
        
        // If we have anything other than an "approved" response, assume request was approved
        if (res.data.approved !== false) {
          clearInterval(interval);

          // Attempt to decrypt the account using the password
          const encryptedAccount = res.data as EncryptedAccount;
          const rootKey = await account.decryptRootKey(password.value, encryptedAccount).catch((e) => {
            loading.value = false;

            error.value.message = e;
            error.value.show = true;
          });

          // Using the root key we can sign the login token to get our JWT
          const keypair = await account.deriveIdentityKeypair(rootKey as Uint8Array);
          const tokenNonce = encryptedAccount.token.nonce;

          if (!tokenNonce) {
            error.value.show = true;
            error.value.message = "An unexpected error has occurred!";
            return;
          }

          const signature = await account.signMessage(keypair, tokenNonce);
          
          // Send the token ID and signature back to the API so we can receive a longer lived access token
          await authService.CreateLoginSession(username.value, encryptedAccount.token.id, signature)
            .then(res => {
              const accessToken = res.data.access_token;
              if (accessToken) {
                loading.value = false;

                // Set token and username in Vuex
                store.dispatch("login", accessToken);
                store.dispatch("setUsername", username.value);
              }
            })
            .catch(e => {
              loading.value = false;

              error.value.message = e.response.data.error;
              error.value.show = true;

              return;
            });
        }
      } catch (e) {
        clearInterval(interval);
      }
    }, 2000)
  }

  // Handle TOTP if it's enabled
  if (otpEnabled.value) {
    console.log("User has TOTP on their account...");
  }

  
}
</script>
