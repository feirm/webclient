<template>
<div class="flex justify-center items-center m-6 md:m-24">
    <div class="container w-4/5 md:w-2/5 rounded-lg p-12 shadow-sm bg-gray-100 mb-3">
      <h1 class="text-2xl text-center font-semibold md:text-3xl text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600">
        Welcome to Feirm
      </h1>
      <p class="text-gray-900 text-lg text-center">Your private and secure non-custodial wallet.</p>

      <form @submit.prevent class="mt-6 mb-6 w-3/5 mx-auto space-y-3">
        <!-- Error alert -->
        <div class="bg-red-100 p-3 rounded-lg">
          <p class="text-red-400 text-center">ERROR</p>
        </div>

        <!-- Username -->
        <div class="relative mt-1">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
           <UserIcon class="w-5 h-5 text-gray-600" />
          </div>
          <input type="text" v-model="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="Username" required>
        </div>

        <!-- Email Address -->
        <div class="relative mt-1">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
           <AtSymbolIcon class="w-5 h-5 text-gray-600" />
          </div>
          <input type="email" v-model="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="Email Address" required>
        </div>

        <!-- Password -->
        <div class="relative mt-1">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
           <LockClosedIcon class="w-5 h-5 text-gray-600" />
          </div>
          <input type="password" v-model="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="●●●●●●●●" required>
        </div>
      
        <b-button type="submit" class="w-full" :loading="loading">Sign up</b-button>
      </form>

      <div class="flex items-center">
        <router-link to="/app/login" class="text-sm text-orange mx-auto">
          Already have an account? Log in here!
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserIcon, LockClosedIcon, AtSymbolIcon } from "@heroicons/vue/solid";

// Fields
const username = ref();
const email = ref();
const password = ref();
const passwordConfirmation = ref();

const loading = ref(false);
</script>