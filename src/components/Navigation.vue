<template>
  <nav
    class="
      fixed
      flex
      backdrop-blur
      px-8
      py-1
      justify-between
      top-0
      inset-x-0
      bg-white bg-opacity-80
    "
  >
    <!-- Left side -->
    <div class="flex items-center space-x-3">
      <div class="block text-orange p-3">Feirm</div>
    </div>

    <!-- Right side -->
    <div class="flex items-center space-x-3">
      <b-button :light="true">
        <span class="inline-flex items-center">
          Log in
          <LockClosedIcon class="w-4 h-4 ml-1 inline-block" />
        </span>
      </b-button>

      <b-button>
        <span class="inline-flex items-center">
          Sign up
          <UserAddIcon class="w-4 h-4 ml-1 inline-block" />
        </span>
      </b-button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { UserAddIcon, LockClosedIcon } from "@heroicons/vue/solid"
</script>