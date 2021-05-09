<template>
  <!-- Hero -->
  <div class="bg-white">
    <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-base font-semibold text-orange tracking-wide uppercase">
          Introducing the
        </h2>
        <p
          class="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
        >
          Feirm token
        </p>
        <p class="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          Fueling the ecosystem through the power of decentralisation with XFE.
        </p>
      </div>
    </div>
  </div>

  <!-- Features -->
  <div class="bg-gray-50 overflow-hidden">
    <div class="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <svg
        class="absolute top-0 left-full transform -translate-x-1/2 -translate-y-3/4 lg:left-auto lg:right-full lg:translate-x-2/3 lg:translate-y-1/4"
        width="404"
        height="784"
        fill="none"
        viewBox="0 0 404 784"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="8b1b5f72-e944-4457-af67-0c6d15a99f38"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="0"
              y="0"
              width="4"
              height="4"
              class="text-gray-200"
              fill="currentColor"
            />
          </pattern>
        </defs>
        <rect
          width="404"
          height="784"
          fill="url(#8b1b5f72-e944-4457-af67-0c6d15a99f38)"
        />
      </svg>

      <div class="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
        <div class="lg:col-span-1">
          <h2
            class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            The XFE token has it all.
          </h2>
        </div>
        <dl
          class="mt-10 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:mt-0 lg:col-span-2"
        >
          <div v-for="feature in features" :key="feature.name">
            <dt>
              <div
                class="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white"
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
  </div>

  <!-- Reserves -->
  <div class="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-6">
    <h2
      class="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl sm:tracking-tight lg:text-4xl"
    >
      Reserves
    </h2>

    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
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
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Address
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="asset in addresses" :key="asset.address">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 w-10">
                        <img class="w-8" :src="asset.logo" alt="Logo" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ asset.asset }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-700">{{ asset.type }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {{ asset.description }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {{ asset.address }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {{ asset.amount }} {{ asset.ticker.toUpperCase() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import {
  GlobeAltIcon,
  ChartBarIcon,
  MailIcon,
  ScaleIcon,
} from "@heroicons/vue/outline";

const features = [
  {
    name: "Accessibility",
    description:
      "Operating on the Binance Smart Chain, the XFE token is easily accessible through the platform or an external wallet such as Metamask.",
    icon: GlobeAltIcon,
  },
  {
    name: "Lorem ipsum",
    description:
      "Corporis quisquam nostrum nulla veniam recusandae temporibus aperiam officia incidunt at distinctio ratione.",
    icon: ScaleIcon,
  },
  {
    name: "Limited supply",
    description:
      "There can only be a maximum of 40 million XFE tokens in supply, making it a scarce asset.",
    icon: ChartBarIcon,
  },
  {
    name: "Lorem ipsum",
    description:
      "Veniam necessitatibus reiciendis fugit explicabo dolorem nihil et omnis assumenda odit? Quisquam unde accusantium.",
    icon: MailIcon,
  },
];

const addresses = [
  {
    asset: "Feirm (XFE)",
    ticker: "xfe",
    logo: require("@/assets/img/logo.webp"),
    type: "Cold storage",
    description: "Token deployment wallet",
    address: "0x2de02dd1da1883a36c70b452b335a0af21281cd5",
    amount: 0,
  },
  {
    asset: "Feirm (XFE)",
    ticker: "xfe",
    logo: require("@/assets/img/logo.webp"),
    type: "Hot wallet",
    description: "Migration bridge wallet",
    address: "0xfa88d2f56e8265ac935fadae4a8b70c7547e3ce4",
    amount: 0,
  },
  {
    asset: "Feirm (XFE)",
    ticker: "xfe",
    logo: require("@/assets/img/logo.webp"),
    type: "Cold storage",
    description: "Team funds",
    address: "0x5dd03a2de5e1e16cf24e604437d629f10567472b",
    amount: 0,
  },
  {
    asset: "Feirm (XFE)",
    ticker: "xfe",
    logo: require("@/assets/img/logo.webp"),
    type: "Cold storage",
    description: "Platform funds",
    address: "0x7b351bafd338ede7f876f894df863ca3df21ade8",
    amount: 0,
  },
];

export default defineComponent({
  setup() {
    const address = ref();

    return {
      address,
      features,
      addresses,
    };
  },
});
</script>
