<template>
  <!-- Hero -->
  <div class="bg-white">
    <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div class="text-left space-y-3">
        <p
          class="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
        >
          Platform
        </p>
        <p class="max-w-xl text-xl">
          Feirm is a
          <b class="text-orange">non-custodial</b> platform. Using cryptography,
          you are able to remain in complete control of your funds.
        </p>
      </div>
    </div>
  </div>

  <!-- Features -->
  <div class="p-12 bg-gray-100">
    <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <dl class="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
        <div v-for="feature in features" :key="feature.name">
          <dt>
            <div
              class="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-orange-600 to-yellow-500  text-white"
            >
              <component
                :is="feature.icon"
                class="h-6 w-6"
                aria-hidden="true"
              />
            </div>
            <p class="mt-5 text-lg leading-6 font-medium text-gray-900">
              {{ feature.name }}
            </p>
          </dt>
          <dd class="mt-2 text-base text-gray-500">
            {{ feature.description }}
          </dd>
        </div>
      </dl>
    </div>
  </div>

  <!-- Token showcase -->
  <div class="p-12 bg-white">
    <div class="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 space-y-3">
      <h2 class="text-2xl font-medium">
        Support for your favourite digital assets.
      </h2>

      <div class="overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Asset
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="token in tokens" :key="token.ticker">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-9 rounded-full" :src="token.logo" alt="" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ token.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ token.ticker.toUpperCase() }}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Create account banner -->
  <div class="bg-grey-500">
    <div
      class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:justify-between"
    >
      <div class="mx-auto space-y-6 text-center">
        <img class="mx-auto w-16" src="@/assets/img/logo.webp" alt="Feirm" />
        <h2
          class="text-4xl font-semibold text-gray-100 sm:text-5xl sm:tracking-tight lg:text-5xl"
        >
          Create your <span class="text-orange">Feirm</span> account today.
        </h2>
        <p class="mt-5 text-xl text-gray-100">
          Take back control of your funds. It's quick, free and easy!
        </p>
        <router-link
          to="/app/signup"
          class="block mx-auto text-yellow-900 p-3 bg-orange-500 w-48 rounded-md"
          >Create an account</router-link
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CloudIcon, LockClosedIcon } from "@heroicons/vue/outline";
import { CoinFactory } from "@/class/coins";

const features = [
  {
    name: "Non-custodial web wallet",
    description:
      "Generated and encrypted in the browser, your wallet is untouchable by us, but available to every device you log in with your Feirm account.",
    icon: CloudIcon,
  },
  {
    name: "Encryption",
    description:
      "Feirm accounts have been designed to always remain encrypted throughout the platform. We never come into contact with your password.",
    icon: LockClosedIcon,
  },
];

const tokens = CoinFactory.getCoins();

export default {
  setup() {
    return {
      features,
      tokens,
    };
  },
};
</script>
