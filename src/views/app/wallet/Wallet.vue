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
import { Coin, CoinFactory } from '@/class/coins';
import Web3 from 'web3';

export default defineComponent({
    name: "Wallet",
    data() {
        return {
            recipientAddress: "",
            amount: "",
            submitted: false
        }
    },
    methods: {
        async send() {
            this.submitted = true;

            // Need to handle normal send and token transfers differently,
            // so check if token has a contract associated to it
            if (this.token.contract) {
                // Initialise a token transfer
                try {
                    const hash = await ethWallet.sendTokens(this.recipientAddress, this.amount, this.token.contract, this.token.network);

                    this.submitted = false;
                    this.$toast.success(hash);
                } catch (e) {
                    this.submitted = false;
                    return this.$toast.error(e);
                }

                // Balance update
                const contract = ethWallet.getContract(this.token.contract, this.token.network);
                const weiBalance = await contract.methods.balanceOf(this.address).call();
                
                // Convert Wei balance to Ether
                this.balance = Web3.utils.fromWei(weiBalance, "ether");
            }

            // Otherwise it's likely a normal transfer
            if (!this.token.contract) {
                try {
                    const hash = await ethWallet.sendCoin(this.recipientAddress, this.amount, this.token.network)

                    this.submitted = false;
                    this.$toast.success(hash);
                } catch (e) {
                    this.submitted = false;
                    return this.$toast.error(e);
                }

                // Balance update
                const web3 = ethWallet.getWeb3(this.token.network);
                const weiBalance = await web3.eth.getBalance(this.address);

                // Convert Wei balance to Ether
                this.balance = Web3.utils.fromWei(weiBalance, "ether");
            }
        }
    },
    setup() {
        const route = useRoute();
        const ticker = route.params.ticker;

        const address = ethWallet.getWallet().getAddressString();

        const token = ref({} as Coin);
        const addressQr = ref();
        const balance = ref();

        onMounted(async () => {
            token.value = CoinFactory.getCoin(ticker as string);

            // Generate a QR of receiving address
            addressQr.value = await qrcode.toDataURL(address);

            // Need to fetch token balance. If token has a contract,
            // get balance from the contract
            if (token.value.contract) {
                const contract = ethWallet.getContract(token.value.contract, token.value.network);
                const weiBalance = await contract.methods.balanceOf(address).call();
                
                // Convert Wei balance to Ether
                balance.value = Web3.utils.fromWei(weiBalance, "ether");
            } else {
                // Otherwise fetch balance for address
                const web3 = ethWallet.getWeb3(token.value.network);
                const weiBalance = await web3.eth.getBalance(address);

                // Convert Wei balance to Ether
                balance.value = Web3.utils.fromWei(weiBalance, "ether");
            }
        })

        return {
            token,
            ticker,
            address,
            addressQr,
            balance
        }
    }
})
</script>
