<template>
    <button
        :disabled="loading"
        class="transition duration-300 ease-in-out px-3 py-2 w-36 text-sm font-medium border rounded-md focus:outline-none disabled:opacity-50 text-yellow-900 bg-orange-500 border-orange-500 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200"
    >
        <slot v-if="!loading">Button</slot>
        <svg
            v-else
            class="animate-spin mx-auto h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            />
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
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
        }
    },
});
</script>