<template>
  <nav class="space-y-2 p-4 border rounded-md" aria-label="Sidebar">
    <router-link
      v-for="item in navigation"
      link-active-class="bg-red-500 text-gray-900"
      :key="item.name"
      :to="item.href"
      active-class="bg-gray-200"
      class="text-gray-600 flex items-center px-4 py-2 text-sm font-medium rounded-md"
    >
      <component
        :is="item.icon"
        class="flex-shrink-0 -ml-1 mr-3 h-6 w-6"
        aria-hidden="true"
      />
      <span class="truncate">
        {{ item.name }}
      </span>
    </router-link>
  </nav>
</template>

<script>
import { UserIcon, LoginIcon } from "@heroicons/vue/outline";

const navigation = [
  {
    name: "My Account",
    href: "/app/account",
    icon: UserIcon,
  },
  {
    name: "Two-Step Login",
    href: "/app/account/two-factor",
    icon: LoginIcon,
  },
];

export default {
  setup() {
    return {
      navigation,
    };
  },
};
</script>
