<template>
    <div class="max-w-7xl mx-auto py-6 p-4 lg:px-8">
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div class="p-6 border-r border-gray-300 space-y-6">
                <!-- Balance -->
                <div class="space-y-0">
                    <h1 class="font-light text-2xl">Balance</h1>
                    <h2 class="font-medium text-2xl">{{ balance }} {{ ticker.toUpperCase() }}</h2>
                </div>

                <hr class="m-3">

                <!-- Send actions -->
                <h1 class="font-light text-xl">Send {{ ticker.toUpperCase() }}</h1>

                <form @submit.prevent="send(ticker)" class="space-y-6">
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-700">Recipient address</label>
                        <div class="mt-1">
                            <input name="address" v-model="recipientAddress" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                        </div>
                    </div>

                    <div>
                        <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
                        <div class="mt-1">
                            <input name="amount" v-model="amount" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
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
import Web3 from 'web3';
import account from '@/class/account';

export default defineComponent({
    name: "Wallet",
    data() {
        return {
            recipientAddress: "",
            amount: ""
        }
    },
    methods: {
        async send(token: string) {
            // Handle BNB only
            if (token === 'bnb') {
                const tx = await ethWallet.sendCoin(this.recipientAddress, this.amount);
            }
        }
    },
    setup() {
        const route = useRoute();
        const ticker = route.params.ticker;

        const address = ethWallet.getWallet().getAddressString();

        const addressQr = ref();
        const balance = ref();

        onMounted(async () => {
            // Get Web3 connection and fetch balance
            const web3 = ethWallet.getWeb3("bsc");
            const bal = await web3.eth.getBalance(address);
            const amount = Web3.utils.fromWei(bal, "ether");
            balance.value = amount;

            // Generate a QR of receiving address
            addressQr.value = await qrcode.toDataURL(address);
        })

        return {
            ticker,
            address,
            addressQr,
            balance
        }
    }
})
</script>
