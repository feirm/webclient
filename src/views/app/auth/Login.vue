<template>
  <div class="grid place-items-center h-full m-6 md:m-24">
    <div class="container w-4/5 md:w-2/5 rounded-lg p-12 shadow-sm bg-gray-100 mb-3">
      <h1 class="text-2xl text-center font-semibold md:text-3xl text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600">
        Feirm
      </h1>
      <p class="text-gray-900 text-lg text-center">Your private and secure non-custodial wallet.</p>

      <form @submit.prevent class="mt-6 mb-6 w-3/5 mx-auto space-y-3">
        <!-- Username -->
        <div class="relative mt-1">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
           <UserIcon class="w-5 h-5 text-gray-600" />
          </div>
          <input type="text" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="Username">
        </div>

        <!-- Password -->
        <div class="relative mt-1">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
           <LockClosedIcon class="w-5 h-5 text-gray-600" />
          </div>
          <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="●●●●●●●●">
        </div>

        <!-- OTP -->
        <label for="otp" class="block text-sm font-medium text-gray-900">OTP</label>
        <div class="relative mt-1">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
           <ClockIcon class="w-5 h-5 text-gray-600" />
          </div>
          <input type="number" id="otp" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="Six-digit OTP">
        </div>
      
        <b-button type="submit" class="w-full">Log in</b-button>
      </form>
    </div>

    <!-- Ask for account -->
    <router-link to="/app/signup" class="text-center text-orange text-lg hover:underline">Don't have an account? Let's create one!</router-link>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, LockClosedIcon, ClockIcon } from "@heroicons/vue/solid";
</script>
