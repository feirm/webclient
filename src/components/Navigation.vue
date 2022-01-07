<template>
  <Disclosure as="nav" v-slot="{ open }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <router-link :to="isLoggedIn ? '/app' : '/'">
              <img
                class="block lg:hidden h-10 w-auto"
                src="@/assets/img/navbar_logo.webp"
                alt="Feirm"
              />
              <img
                class="hidden lg:block h-10 w-auto"
                src="@/assets/img/navbar_logo.webp"
                alt="Feirm"
              />
            </router-link>
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <router-link
                v-if="!isLoggedIn"
                to="/platform"
                class="text-grey-500 hover:text-grey-900 px-3 rounded-md text-sm font-medium"
                >Platform</router-link
              >
              <router-link
                v-if="!isLoggedIn"
                to="/token"
                class="text-grey-500 hover:text-grey-800 px-3 rounded-md text-sm font-medium"
                >Token</router-link
              >

              <!-- Authenticated routes -->
              <router-link
                to="/app/wallet"
                v-if="isLoggedIn"
                class="text-grey-500 hover:text-grey-800 px-3 rounded-md text-sm font-medium"
                >Wallet</router-link
              >
            </div>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex items-center">
            <div class="flex-shrink ml-3" v-if="!isLoggedIn">
              <router-link
                to="/app/login"
                class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-orange hover:text-yellow-400"
              >
                <span>Sign in</span>
              </router-link>
            </div>

            <div class="flex-shrink-0 ml-3" v-if="!isLoggedIn">
              <router-link
                to="/app/signup"
                class="block items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-yellow-900 bg-orange-500 hover:bg-orange-400"
              >
                <span>Create an account</span>
              </router-link>
            </div>

            <!-- Profile dropdown -->
            <Menu v-if="isLoggedIn" as="div" class="ml-3 relative">
              <div>
                <MenuButton
                  class="bg-gray-800 flex text-sm rounded-full focus:outline-none"
                >
                  <span class="sr-only">Open user menu</span>
                  <span class="inline-block overflow-hidden">
                    <UserCircleIcon class="w-6 h-6 text-white" />
                  </span>
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <!-- My account -->
                  <router-link
                    custom
                    to="/app/account"
                    v-slot="{ href, navigate }"
                  >
                    <MenuItem
                      :href="href"
                      @click="navigate"
                      v-slot="{ active }"
                    >
                      <a
                        :class="[
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700',
                        ]"
                        >My account</a
                      >
                    </MenuItem>
                  </router-link>

                  <!-- TODO: Add more links -->
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <div class="-mr-2 flex sm:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span class="sr-only">Open main menu</span>
            <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <!-- MOBILE VIEW -->
    <DisclosurePanel class="sm:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <router-link
          v-if="!isLoggedIn"
          to="/platform"
          class="text-gray-300 hover:bg-grey-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >Platform</router-link
        >

        <router-link
          v-if="!isLoggedIn"
          to="/token"
          class="text-gray-300 hover:bg-grey-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >Token</router-link
        >

        <router-link
          v-if="!isLoggedIn"
          to="/app/login"
          class="text-gray-300 hover:bg-grey-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >Sign in</router-link
        >

        <router-link
          v-if="!isLoggedIn"
          to="/app/signup"
          class="text-gray-300 hover:bg-grey-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >Sign up</router-link
        >

        <!-- Authenticated routes -->
        <router-link
          to="/app/wallet"
          v-if="isLoggedIn"
          class="text-gray-300 hover:bg-grey-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >Wallet</router-link
        >
      </div>
      <div class="pb-3 border-t border-gray-700">
        <div class="mt-3 px-2 space-y-1">
          <router-link
            v-if="isLoggedIn"
            to="/app/account"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
            >My account</router-link
          >
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script>
import { ref } from "vue";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { MenuIcon, XIcon } from "@heroicons/vue/outline";
import { UserCircleIcon } from "@heroicons/vue/solid";
import { mapGetters } from "vuex";

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,

    MenuIcon,
    XIcon,
    UserCircleIcon,
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  setup() {
    const open = ref(false);

    return {
      open,
    };
  },
};
</script>
