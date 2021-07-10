<template>
  <button
    @click="onClick"
    :disabled="loading"
    class="transition duration-300 ease-in-out px-3 py-2 w-36 text-sm border rounded-md focus:outline-none text-yellow-900 bg-orange-500 border-orange-500 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200 disabled:opacity-50"
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
    onClick: {
      type: Function,
      required: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
