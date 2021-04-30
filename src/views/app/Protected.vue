<template>
  <div class="flex h-2/4 flex-col bg-gray-100">

    <!-- Wallet -->
    <div class="p-6 md:p-20 space-y-4 w-full md:w-1/3 mx-auto">
      <h1 class="text-5xl font-light text-center">Welcome to Feirm!</h1>
      <p>Your all in one ecosystem and cryptocurrency wallet. To get started, you need to create a wallet. Please pick one of the options below.</p>

      <div class="bg-white p-6 rounded shadow space-y-3">
        <h1 class="text-xl text-center">Create a new wallet</h1>
        <p>Don't have a cryptocurrency wallet just yet? We'll take you through the process of creating one, backing it up and using it with a wide variety of cryptocurrencies we support.</p>
        <button class="block p-3 bg-orange-500 w-full rounded shadow text-white font-light">Get started</button>
      </div>

      <div class="bg-white p-6 rounded shadow space-y-3">
        <h1 class="text-xl text-center">Restore from a backup</h1>
        <p>Do you have your 12 or 24 word mnemonic to hand? We'll guide you through the recovery process so you can use your cryptocurrencies again!</p>
        <button class="block p-3 bg-orange-500 w-full rounded shadow text-white font-light">Start wallet recovery</button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Protected",
  data() {
    return {
      account: ""
    };
  },
});
</script>
