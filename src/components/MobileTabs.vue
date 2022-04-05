<template>
<nav class="fixed lg:hidden bottom-0 p-1 pt-2 w-full border bg-gray-100 flex flex-row overflow-x-auto">
    <div v-for="button in buttons" :key="button.label" class="flex flex-col flex-grow items-center text-center">
        <router-link :to="button.route">
            <font-awesome-icon class="fa-lg text-gray-700" :icon="button.icon" />
            <br>
            <span class="text-sm align-middle">{{ button.label }}</span>
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
    },
    {
        label: "Wallet",
        route: "/app/wallet",
        icon: "wallet"
    },
    {
        label: "Profile",
        route: "/app/profile",
        icon: "user"
    },
    {
        label: "Settings",
        route: "/app/settings",
        icon: "gear"
    }
])
</script>