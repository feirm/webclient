<template>
  <div class="max-w-7xl mx-auto py-6 p-4 lg:px-8">
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-2">
      <div class="p-6 border-r border-gray-300 space-y-6">
        <!-- Balance -->
        <div class="space-y-0">
          <h1 class="font-light text-2xl">Balance</h1>
          <h2 class="font-medium text-2xl">
            {{ balance }} {{ ticker.toUpperCase() }}
          </h2>
        </div>

        <hr class="m-3" />

        <!-- Send actions -->
        <h1 class="font-light text-xl">Send {{ ticker.toUpperCase() }}</h1>

        <form
          @submit.prevent="
            showConfirmTransactionModal = !showConfirmTransactionModal
          "
          class="space-y-6"
        >
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700"
              >Recipient address</label
            >
            <div class="mt-1">
              <input
                name="address"
                v-model="recipientAddress"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700"
              >Amount</label
            >
            <div class="mt-1">
              <input
                name="amount"
                v-model="amount"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
          </div>

          <div v-show="isEth">
            <label for="amount" class="block text-sm font-medium text-gray-700"
              >Gas Price</label
            >
            <div class="mt-1">
              <input
                name="amount"
                v-model="gasprice"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
          </div>

          <div v-show="isEth">
            <label for="amount" class="block text-sm font-medium text-gray-700"
              >Gas Limit</label
            >
            <div class="mt-1">
              <input
                name="amount"
                v-model="gaslimit"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              :disabled="submitted"
              type="submit"
              class="w-full flex disabled:opacity-50 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-900 bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <span v-if="!submitted">Send</span>
              <img
                v-else
                class="mx-auto w-5"
                src="@/assets/loading_spinner.svg"
              />
            </button>
          </div>

          <div class="text-sm text-center">
            <router-link
              to="/app"
              class="font-medium text-gray-600 hover:text-gray-900"
            >
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

        <img :src="addressQr" alt="Address QR" />
      </div>
    </div>
  </div>

  <confirm-modal
    v-if="showConfirmTransactionModal"
    heading="Send transaction?"
    message="Are you sure you want to make this transaction?"
    @confirmEvent="send(ticker)"
    @close="showConfirmTransactionModal = false"
  ></confirm-modal>
</template>

<script lang="ts">
import ethWallet from "@/class/wallets/eth-wallet";
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import qrcode from "qrcode";
import { Coin, CoinFactory } from "@/class/coins";
import Web3 from "web3";
import { EncryptedWallet } from "@/models/wallet";
import walletService from "@/service/api/walletService";
import account from "@/class/account";

import ConfirmModal from "@/components/ConfirmModal.vue";
import btcP2wpkhWallet from "@/class/wallets/btc-p2wpkh-wallet";

export default defineComponent({
  name: "Wallet",
  data() {
    return {
      recipientAddress: "",
      amount: "",

      // ETH/BSC related stuff
      isEth: false,
      gasprice: "",
      gaslimit: 21000,

      submitted: false,
      showConfirmTransactionModal: false,
    };
  },
  components: {
    ConfirmModal,
  },
  async mounted() {
    if (this.coin.network === "ethereum" || this.coin.network === "binance") {
      this.isEth = true;

      // Fetch recommended gas price
      const web3 = ethWallet.getWeb3(this.coin.network);
      const gasPrice = await web3.eth.getGasPrice();

      // Convert into gwei
      const gwei = Web3.utils.fromWei(gasPrice, "gwei");
      this.gasprice = gwei;

      // If we are interacting with a contract (likely ERC20 or BEP20 token), then we need to fetch a higher gas limit
      if (this.coin.contract) {
        this.gaslimit = 100000;
      }
    }
  },
  methods: {
    async send() {
      this.showConfirmTransactionModal = !this.showConfirmTransactionModal;

      // Check balance
      if (this.amount == "0") {
        return this.$toast.error("Cannot send empty balance!");
      }

      this.submitted = true;

      // Need to handle normal send and token transfers differently,
      // so check if token has a contract associated to it
      if (this.coin.contract) {
        // Initialise a token transfer
        try {
          const hash = await ethWallet.sendTokens(
            this.recipientAddress,
            this.amount,
            this.coin.contract,
            this.gasprice,
            this.gaslimit,
            this.coin.network
          );

          this.submitted = false;
          this.$toast.success(hash);
        } catch (e) {
          this.submitted = false;
          return this.$toast.error(e);
        }

        // Balance update
        const contract = ethWallet.getContract(
          this.coin.contract,
          this.coin.network
        );
        const weiBalance = await contract.methods
          .balanceOf(this.address)
          .call();

        // Convert Wei balance to Ether
        this.balance = Web3.utils.fromWei(weiBalance, "ether");
      }

      // Otherwise it's likely a normal transfer
      if (!this.coin.contract) {
        try {
          const hash = await ethWallet.sendCoin(
            this.recipientAddress,
            this.amount,
            this.gasprice,
            this.gaslimit,
            this.coin.network
          );

          this.submitted = false;
          this.$toast.success(hash);
        } catch (e) {
          this.submitted = false;
          return this.$toast.error(e);
        }

        // Balance update
        const web3 = ethWallet.getWeb3(this.coin.network);
        const weiBalance = await web3.eth.getBalance(this.address);

        // Convert Wei balance to Ether
        this.balance = Web3.utils.fromWei(weiBalance, "ether");
      }
    },
  },
  setup() {
    const route = useRoute();
    const ticker = route.params.ticker;

    const coin = ref({} as Coin);
    const address = ref();
    const addressQr = ref();
    const balance = ref();

    onMounted(async () => {
      coin.value = CoinFactory.getCoin(ticker as string);

      // Fetch encrypted wallet and decrypt it
      let wallet: EncryptedWallet;
      try {
        const res = await walletService.GetWallet();
        wallet = res.data;
      } catch (e) {
        console.log("[Wallet]: " + e.response.data.error);
      }

      // Decrypt wallet and set mnemonic
      const rootKey = account.getRootKey();
      const mnemonic = await ethWallet.decryptWallet(rootKey, wallet);
      ethWallet.setMnemonic(mnemonic);
      btcP2wpkhWallet.setMnemonic(mnemonic);

      // Set the address depending on the network (Binance, Ethereum or Bitcoin)
      if (
        coin.value.network === "ethereum" ||
        coin.value.network === "binance"
      ) {
        const eth = ethWallet.getWallet();
        address.value = eth.getAddressString();
      } else if (coin.value.network === "bitcoin") {
        address.value = btcP2wpkhWallet.getAddress(coin.value.ticker, 0, 0);
      }

      // Generate a QR of receiving address
      addressQr.value = await qrcode.toDataURL(address.value);

      // Need to fetch token balance. If token has a contract,
      // get balance from the contract
      if (coin.value.contract) {
        const contract = ethWallet.getContract(
          coin.value.contract,
          coin.value.network
        );
        const weiBalance = await contract.methods
          .balanceOf(address.value)
          .call();

        // Convert Wei balance to Ether
        balance.value = Web3.utils.fromWei(weiBalance, "ether");
      } else {
        // Otherwise fetch balance for address
        const web3 = ethWallet.getWeb3(coin.value.network);
        const weiBalance = await web3.eth.getBalance(address.value);

        // Convert Wei balance to Ether
        balance.value = Web3.utils.fromWei(weiBalance, "ether");
      }
    });

    return {
      coin,
      ticker,
      address,
      addressQr,
      balance,
    };
  },
});
</script>
