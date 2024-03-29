<template>
  <div class="min-h-screen flex flex-col">
    <!-- Landing hero -->
    <div class="flex-grow p-10 sm:p-40 bg-grey-500">
      <div class="space-y-3">
        <img class="w-24 mx-auto" src="@/assets/img/logo.webp" alt="Logo" />
        <h1
          class="md:w-2/4 mx-auto text-4xl text-center font-semibold md:text-6xl mb-10 text-orange"
        >
          An ecosystem where privacy is for everyone.
        </h1>
        <p class="md:w-1/3 mx-auto text-2xl text-center text-gray-100">
          A blockchain project and platform built for your privacy. Take a deep
          dive into the Feirm Ecosystem and experience the ultimate privacy and
          security provided by design.
        </p>
      </div>
    </div>

    <!-- What do we offer? -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <p
            class="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            What do we have to offer?
          </p>
        </div>

        <div class="mt-10">
          <dl
            class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10"
          >
            <div
              v-for="feature in features"
              :key="feature.name"
              class="relative"
            >
              <dt>
                <div
                  class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-orange-600 to-yellow-500 text-white"
                >
                  <component
                    :is="feature.icon"
                    class="h-6 w-6"
                    aria-hidden="true"
                  />
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">
                  {{ feature.name }}
                </p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                {{ feature.description }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="relative bg-grey-100 py-16">
      <div
        class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl"
      >
        <h2
          class="text-base font-semibold tracking-wider text-orange uppercase"
        >
          Features
        </h2>
        <p
          class="mt-2 text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl"
        >
          Explore our ecosystem.
        </p>
        <p class="mt-5 max-w-prose mx-auto text-xl text-gray-500">
          Feirm provides a variety of applications within our ecosystem for
          everyone to use.
        </p>
        <div class="mt-12">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="feature in ecosystem" :key="feature.name" class="pt-6">
              <div class="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div class="-mt-6">
                  <div>
                    <span
                      class="inline-flex items-center justify-center p-3 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-md shadow-lg"
                    >
                      <component
                        :is="feature.icon"
                        class="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <h3
                    class="mt-8 text-lg font-medium text-gray-900 tracking-tight"
                  >
                    {{ feature.name }}
                  </h3>
                  <p class="mt-5 text-base text-gray-500 text-left">
                    {{ feature.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Are you interested section -->
    <div class="bg-grey-500">
      <div
        class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:justify-between"
      >
        <div class="mx-auto space-y-6 text-center">
          <img class="mx-auto w-16" src="@/assets/img/logo.webp" alt="Feirm" />
          <h2
            class="text-4xl font-semibold text-gray-100 sm:text-5xl sm:tracking-tight lg:text-5xl"
          >
            Are you still interested?
          </h2>
          <p class="mt-5 text-xl text-gray-100">
            Creating a <span class="text-orange">Feirm</span> account is quick,
            free and easy.
          </p>
          <router-link
            to="/app/signup"
            class="block mx-auto text-yellow-900 p-3 bg-orange-500 w-48 rounded-md"
            >Get started</router-link
          >
        </div>
      </div>
    </div>

    <!-- Blog posts -->
    <div class="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pb-28 lg:px-8">
      <div class="absolute inset-0">
        <div class="bg-white h-1/3 sm:h-2/3" />
      </div>
      <div class="relative max-w-7xl mx-auto">
        <div class="text-center">
          <h2
            class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl"
          >
            Latest articles
          </h2>
          <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Take a look at what we've been getting up to recently!
          </p>
        </div>
        <div
          class="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none"
        >
          <div
            v-for="post in articles"
            :key="post.title"
            class="flex flex-col rounded-lg shadow-lg overflow-hidden"
          >
            <div class="flex-shrink-0">
              <img class="h-48 w-full object-cover" :src="post.thumbnail" />
            </div>
            <div
              class="flex-1 bg-white p-6 flex flex-col justify-between space-y-3"
            >
              <div class="flex-1">
                <a :href="post.link" class="block mt-2">
                  <p class="text-xl text-center font-semibold text-gray-900">
                    {{ post.title }}
                  </p>
                </a>
              </div>
              <div class="flex items-center mx-auto">
                <div class="flex space-x-1 text-sm text-gray-500">
                  <time :datetime="post.pubDate">
                    {{ post.pubDate }}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  GlobeIcon,
  HeartIcon,
  FingerPrintIcon,
  CurrencyPoundIcon,
  CollectionIcon,
  SwitchHorizontalIcon,
  UsersIcon,
  ShoppingBagIcon,
  DatabaseIcon,
  ChatAlt2Icon
} from "@heroicons/vue/outline";
import axios from "axios";

const features = [
  {
    name: "Ultimate security",
    description:
      "Feirm accounts are protected with mandatory two-factor authentication and heavy zero-knowledge encryption. Your data is safe with us.",
    icon: FingerPrintIcon
  },
  {
    name: "Web wallet",
    description:
      "Feirm provides a non-custodial wallet featuring support for many cryptocurrencies and tokens. The private keys remain in your browser whilst we link an encrypted version of your wallet to your Feirm account.",
    icon: CurrencyPoundIcon
  },
  {
    name: "Open source",
    description:
      "Trust is important when it comes to dealing with cryptography, but it isn't enough. The Feirm web-client is open source for everyone to see.",
    icon: HeartIcon
  },
  {
    name: "Available for everyone",
    description:
      "Privacy should be accessible for everyone. Your Feirm account can be accessed on any device with a web browser - no need for more smartphone apps!",
    icon: GlobeIcon
  }
];

const ecosystem = [
  {
    name: "Feirm token",
    description:
      "Feirm has its own utility token called XFE currently operating on the Binance Smart Chain. It is the backbone of the Feirm ecosystem.",
    icon: CollectionIcon
  },
  {
    name: "Bridge",
    description:
      "Stuck on the old Feirm blockchain? Migrate your old native XFE coins to the new token using our bridge. The migration process is instant and automated!",
    icon: SwitchHorizontalIcon
  },
  {
    name: "Social media rewards",
    description:
      "Coming soon, you'll be able to earn additional XFE tokens by completing small tasks on social media. You'll be spreading awareness of the Feirm project and earning at the same time!",
    icon: UsersIcon
  },
  {
    name: "Marketplace",
    description:
      "All users should be able to transact without limits. Soon you will be able to buy/sell digital assets leveraging some of the best decentralised technologies.",
    icon: ShoppingBagIcon
  },
  {
    name: "Interest",
    description:
      "Soon, you can earn more on top of your investment with compound interest just by keeping them in your Platform wallet. No transfers or lock-in required. Your funds only belong to you.",
    icon: DatabaseIcon
  },
  {
    name: "Community",
    description:
      "Whether you are a beginner in the cryptocurrency world, or simply need some support, the Feirm community and support channels have you covered.",
    icon: ChatAlt2Icon
  }
];

export default defineComponent({
  name: "Index",
  data() {
    return {
      articles: []
    };
  },
  async mounted() {
    const MEDIUM_URL = "https://medium.com/feed/feirm";
    const RSS_JSON =
      "https://api.rss2json.com/v1/api.json?rss_url=" + MEDIUM_URL;

    const articles = await axios.get(RSS_JSON);
    this.articles = articles.data.items.splice(0, 3);
  },
  setup() {
    return {
      features,
      ecosystem
    };
  }
});
</script>
