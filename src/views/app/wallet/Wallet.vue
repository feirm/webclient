<template>
    <div class="max-w-7xl mx-auto py-6 p-4 lg:px-8">
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div class="p-6 border-r border-gray-300 space-y-6">
                <!-- Balance -->
                <div class="space-y-0">
                    <h1 class="font-light text-2xl">Balance</h1>
                    <h2 class="font-medium text-2xl">0.00 {{ ticker.toUpperCase() }}</h2>
                </div>

                <hr class="m-3">

                <!-- Send actions -->
                <h1 class="font-light text-xl">Send {{ ticker.toUpperCase() }}</h1>

                <form @submit.prevent="" class="space-y-6">
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-700">Recipient address</label>
                        <div class="mt-1">
                            <input name="address" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                        </div>
                    </div>

                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-700">Amount</label>
                        <div class="mt-1">
                            <input name="address" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                        </div>
                    </div>

                    <div>
                        <button :disabled="submitted" type="submit" class="w-full flex disabled:opacity-50 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-900 bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                            <span v-if="!submitted">Send</span>
                            <img v-else class="mx-auto w-5" src="@/assets/loading_spinner.svg" />
                        </button>
                    </div>

                    <div class="text-sm text-center">
                        <router-link to="/app" class="font-medium text-gray-600 hover:text-gray-900">
                            View past transactions
                        </router-link>
                    </div>
                </form>
            </div>

            <div class="p-3 bg-white">
                <h1 class="font-light text-2xl">Receiving address</h1>
                <code>
                    {{ address }}
                </code>

                <img :src="addressQr" alt="Address QR">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import ethWallet from '@/class/wallets/eth-wallet';
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import qrcode from "qrcode";

export default defineComponent({
    name: "Wallet",
    setup() {
        const route = useRoute();
        const ticker = route.params.ticker;

        const address = ethWallet.getAddress();
        const addressQr = ref();

        onMounted(async () => {
            addressQr.value = await qrcode.toDataURL(address);
        })

        return {
            ticker,
            address,
            addressQr
        }
    }
})
</script>
