<template>
  <button
    :disabled="loading"
    class="
      px-3
      py-2
      text-white
      rounded-md
      focus:outline-none
      bg-gradient-to-r
      from-orange-600
      via-orange-500
      to-yellow-500
    "
  >
    <slot v-if="!loading">Button</slot>
    <img v-else class="mx-auto w-5" src="@/assets/loading_spinner.svg" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Button",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
});
</script>