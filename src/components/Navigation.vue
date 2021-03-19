<template>
  <!-- navbar goes here -->
  <nav class="bg-grey-500">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between">
        <div class="flex space-x-4">
          <!-- Logo showcase -->
          <div>
            <a
              href="#"
              class="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900"
            >
              <img
                class="object-scale-down w-36"
                src="@/assets/img/navbar_logo.png"
                alt="Navbar Logo"
              />
            </a>
          </div>

          <!-- Left navigation -->
          <div class="hidden md:flex items-center space-x-1">
            <a href="#" class="py-5 px-3 text-white hover:text-gray-300"
              >Platform</a
            >
            <a href="#" class="py-5 px-3 text-white hover:text-gray-300"
              >Blockchain</a
            >
            <router-link
              to="/bridge"
              class="py-5 px-3 text-white hover:text-gray-300"
              >Bridge</router-link
            >
          </div>
        </div>

        <!-- Right navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link v-if="!getIdToken"
            to="/app/login"
            class="py-2 mr-3 px-5 bg-gray-50 hover:bg-gray-200 rounded transition duration-300"
            >Login</router-link
          >
          <router-link v-if="!getIdToken"
            to="/app/signup"
            class="py-2 px-3 bg-orange-500 hover:bg-orange-400 text-yellow-900 hover:text-yellow-800 rounded transition duration-300"
            >Create an account</router-link
          >

          <router-link v-if="getIdToken" to="/" class="text-gray-100 pl-3">{{
            getUsername
          }}</router-link>
        </div>

        <!-- Mobile burger button -->
        <div class="md:hidden flex items-center">
          <button class="mobile-menu-button">
            <svg
              class="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile navigatioon -->
    <div class="mobile-menu hidden md:hidden">
      <a href="#" class="block py-2 px-4 text-sm hover:bg-gray-200">Platform</a>
      <a href="#" class="block py-2 px-4 text-sm hover:bg-gray-200"
        >Blockchain</a
      >
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "Navigation",
  computed: {
    ...mapGetters(["getUsername", "getIdToken"])
  }
});
</script>
