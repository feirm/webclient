<template>
  <div class="flex justify-center items-center m-6 md:m-24">
    <div class="container w-4/5 md:w-2/5 rounded-lg p-12 shadow-sm bg-gray-100 mb-3">
      <h1
        class="text-2xl text-center font-semibold md:text-3xl text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600"
      >Welcome to Feirm</h1>
      <p class="text-gray-900 text-lg text-center">Your private and secure non-custodial wallet.</p>

      <form @submit.prevent="register" class="mt-6 mb-6 w-2/3 mx-auto space-y-3">
        <!-- Error alert -->
        <div v-if="error.show" class="bg-red-100 p-3 rounded-lg">
          <p class="text-red-400 text-center">{{ error.message }}</p>
        </div>

        <!-- Username -->
        <div class="relative mt-1">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <UserIcon class="w-5 h-5 text-gray-600" />
          </div>
          <input
            type="text"
            v-model="username"
            id="username"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
            placeholder="Username"
            required
          />
        </div>

        <!-- Email Address -->
        <div class="relative mt-1">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <AtSymbolIcon class="w-5 h-5 text-gray-600" />
          </div>
          <input
            type="email"
            v-model="email"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
            placeholder="Email Address"
            required
          />
        </div>

        <!-- Password -->
        <div class="relative mt-1">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <LockClosedIcon class="w-5 h-5 text-gray-600" />
          </div>
          <input
            type="password"
            v-model="password"
            id="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
            placeholder="●●●●●●●●"
            required
          />
        </div>

        <!-- Confirm Password -->
        <div class="relative mt-1">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <ShieldCheckIcon class="w-5 h-5 text-gray-600" />
          </div>
          <input
            type="password"
            v-model="passwordConfirmation"
            id="confirmPassword"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
            placeholder="Confirm your password"
            required
          />
        </div>

        <div class="bg-gray-200 p-2 rounded-lg">
          <p class="text-gray-500 text-sm text-center">Remember, there is no way for Feirm to recover your account due to client-side encryption.</p>
        </div>

        <div class="flex flex-col items-center">
          <h-captcha sitekey="c7d7c843-7309-4979-b0c1-4ee8c9f59737" />
        </div>

        <b-button type="submit" class="w-full" :loading="loading">Sign up</b-button>
      </form>

      <div class="flex items-center">
        <router-link
          to="/app/login"
          class="text-sm text-orange mx-auto"
        >Already have an account? Log in here!</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserIcon, LockClosedIcon, AtSymbolIcon, ShieldCheckIcon } from "@heroicons/vue/solid";
import { Account } from "feirmjs";
import authService from '@/service/api/authService';
import { EphemeralToken } from 'feirmjs/src/account/interfaces';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import account from '@/class/account';

const store = useStore();
const router = useRouter();

// Fields
const username = ref();
const email = ref();
const password = ref();
const passwordConfirmation = ref();

const error = ref({
  show: false,
  message: ""
});

const loading = ref(false);

// Function to generate encrypted account
const register = async () => {
  error.value.show = false;
  error.value.message = "";

  // Check that passwords match
  if (password.value !== passwordConfirmation.value) {
    error.value.show = true;
    error.value.message = "Passwords do not match!"

    return;
  }

  const newAccount = new Account();

  // Request ephemeral token to sign
  try {
    let res = await authService.GetRegisterToken();
    const token = res.data as EphemeralToken;

    // Generate root key and encrypt it
    newAccount.generateRootKey();
    const encryptedKey = await newAccount.encryptRootKey(password.value);
    const encryptedAccount = await newAccount.createEncryptedAccount(username.value, email.value, encryptedKey, token);

    const rk = newAccount.getRootKey();
    account.setRootKey(rk);

    // Submit account payment and set access token
    res = await authService.CreateAccount(encryptedAccount);
    const accessToken = res.data.access_token;

    store.dispatch("login", accessToken);
    store.dispatch("setUsername", username.value);

    router.push("/app")
  } catch (e) {
    error.value.show = true;

    if (e.response && e.response.data.error) {
      error.value.message = e.response.data.error;
    } else {
      error.value.message = "An unknown error has occurred!"
    }
  }
}
</script>