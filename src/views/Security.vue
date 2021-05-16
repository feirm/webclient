<template>
  <div>
    <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div class="sm:text-center lg:text-left">
        <h1
          class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
        >
          <span class="block text-orange xl:inline">Security</span>
        </h1>
        <p
          class="mt-3 text-base text-gray-700 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
        >
          Feirm is a <b>non-custodial</b> platform. It uses strong cryptography
          to protect you and ensure that you are always in control. Because of
          this, we hold <b>zero</b> user funds!
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const address = ref();

    return {
      address
    };
  }
});
</script>
