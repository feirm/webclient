<template>
<nav class="fixed bottom-0 p-2 w-full border bg-white flex overflow-x-auto">
    <div v-for="button in buttons" :key="button.label">
        <router-link :to="button.route" class="flex flex-col flex-grow items-center justify-center
		overflow-hidden whitespace-no-wrap text-sm transition-colors duration-100
		ease-in-out hover:bg-gray-200 focus:text-orange-500">
            <font-awesome-icon class="fa-2xl" :icon="button.icon" />
            <span class="text-sm">{{ button.label }}</span>
        </router-link>
    </div>
</nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const buttons = ref([
    {
        label: "Home",
        route: "/app",
        icon: "house"
    }
])
</script>