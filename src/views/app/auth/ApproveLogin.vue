<template>
  <!-- Login attempt banner -->
  <div class="p-4 text-center text-gray-100 bg-red-400">
    <h1 class="text-2xl font-semibold">Approve login request</h1>
  </div>

  <div class="flex justify-center items-center m-6 md:m-24">
    <div class="container w-4/5 md:w-2/5 rounded-lg p-12 shadow-sm bg-gray-100 mb-3 space-y-3">
      <p class="text-gray-900 text-lg text-center">A login attempt has been detected for your Feirm account. Please review the details below and approve or decline the request.</p>

      <div class="flex space-x-3 justify-center">
        <button
          class="block w-full p-3 shadow-sm text-base font-medium rounded-md text-white bg-green-400 hover:bg-green-300 focus:outline-none"
        >Approve</button>

        <button
          class="block w-full p-3 shadow-sm text-base font-medium rounded-md text-white bg-red-400 hover:bg-red-300 focus:outline-none"
        >Decline</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";

onMounted(async () => {
  // Output token
  const token = useRoute().params.token;
  alert(token);
})
</script>
