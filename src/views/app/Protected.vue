<template>
  <div class="flex flex-col">

    <!-- Wallet -->
    <div class="p-6 md:p-12 space-y-4 w-full md:w-1/4 mx-auto">
      <h1 class="text-5xl font-light text-center">Your wallets</h1>
      <div class="p-4 bg-gray-200 rounded shadow">
        <p>Store your cryptocurrency securely with our web wallet.</p>
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
