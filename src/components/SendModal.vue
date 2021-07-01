<template>
  <TransitionRoot as="template" :show="open">
    <Dialog
      as="div"
      static
      class="fixed z-10 inset-0 overflow-y-auto"
      @close="closeEvent"
      :open="open"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="!tx.hex"
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
          >
            <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                @click="closeEvent"
              >
                <span class="sr-only">Close</span>
                <XIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div>
              <div class="text-center space-y-3 mb-3">
                <div v-if="!isLoaded" class="animate-pulse">
                  <div class="rounded-full bg-gray-300 h-12 w-12 mx-auto"></div>
                </div>
                <img
                  v-else
                  :src="coin.logo"
                  class="w-12 mx-auto"
                  :alt="coin.ticker"
                />

                <div v-if="!isLoaded" class="animate-pulse">
                  <div class="bg-gray-300 w-1/3 h-8 mx-auto rounded"></div>
                </div>
                <DialogTitle
                  v-else
                  as="h3"
                  class="text-lg leading-6 font-medium text-gray-900"
                >
                  Send {{ props.ticker.toUpperCase() }}
                </DialogTitle>

                <div class="text-left space-y-2">
                  <!-- Recipient -->
                  <div v-if="!isLoaded" class="animate-pulse space-y-2">
                    <div class="bg-gray-300 w-1/3 h-6 rounded"></div>
                    <div class="bg-gray-300 h-8 rounded"></div>
                  </div>
                  <div v-else>
                    <label
                      for="address"
                      class="block text-sm font-medium text-gray-700"
                      >Recipient Address</label
                    >
                    <div class="mt-1">
                      <input
                        type="text"
                        v-model="address"
                        class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <!-- Amount -->
                  <div v-if="!isLoaded" class="animate-pulse space-y-2">
                    <div class="bg-gray-300 w-1/3 h-6 rounded"></div>
                    <div class="bg-gray-300 h-8 rounded"></div>
                  </div>
                  <div v-else>
                    <label
                      for="amount"
                      class="block text-sm font-medium text-gray-700"
                      >Amount ({{ props.ticker.toUpperCase() }})</label
                    >
                    <div class="flex mt-1 rounded-md shadow-sm">
                      <div class="relative flex items-stretch flex-grow">
                        <input
                          type="number"
                          name="amount"
                          class="block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                          v-model="amount"
                          :disabled="sendMax"
                        />
                      </div>
                      <button
                        v-if="!isEth"
                        class="-ml-px w-16 inline-flex items-center px-4 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 focus:outline-none"
                        :class="sendMax ? 'bg-green-200' : ''"
                        @click="toggleSendMax"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <!-- Gas Limit -->
                  <div v-if="isEth">
                    <div v-if="!isLoaded" class="animate-pulse space-y-2">
                      <div class="bg-gray-300 w-1/3 h-6 rounded"></div>
                      <div class="bg-gray-300 h-8 rounded"></div>
                    </div>
                    <div v-else>
                      <label
                        for="gaslimit"
                        class="block text-sm font-medium text-gray-700"
                        >Gas Limit</label
                      >
                      <div class="mt-1">
                        <input
                          type="number"
                          class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
                          :value="gasLimit"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Transaction fee -->
                  <div v-if="!isLoaded" class="animate-pulse space-y-2">
                    <div class="bg-gray-300 w-1/3 h-6 rounded"></div>
                    <div class="flex space-x-3 justify-center">
                      <div class="rounded bg-gray-300 h-16 w-full"></div>
                      <div class="rounded bg-gray-300 h-16 w-full"></div>
                      <div class="rounded bg-gray-300 h-16 w-full"></div>
                    </div>
                  </div>
                  <div v-else>
                    <label
                      for="address"
                      class="block text-sm font-medium text-gray-700"
                      >Transaction Fee</label
                    >
                    <div class="flex mt-1 space-x-3 justify-center">
                      <button
                        v-for="(fee, i) in fees"
                        :key="fee"
                        class="block w-full p-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        :class="
                          selectedButton === i && userSelectedButton
                            ? 'border-orange-500'
                            : ''
                        "
                        @click="setTxFee(i, fee.amount)"
                      >
                        {{ fee.speed }}
                        <br />
                        <span class="text-sm"
                          >{{ fee.amount }} {{ fee.format }}</span
                        >
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!isLoaded" class="animate-pulse space-y-2">
              <div class="rounded bg-gray-300 h-8 w-full"></div>
              <div class="rounded bg-gray-300 h-8 w-full"></div>
            </div>
            <div v-else class="space-y-2">
              <button
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-400 sm:text-sm disabled:opacity-50"
                @click="createTx(address, amount, sendMax)"
                :disabled="!userSelectedButton"
              >
                <span v-if="!isSubmitted">Send</span>
                <img
                  v-else
                  class="mx-auto w-5"
                  src="@/assets/loading_spinner.svg"
                />
              </button>

              <button
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-400 sm:text-sm"
                @click="closeEvent"
              >
                Cancel
              </button>
            </div>
            <p>{{ tx.hex }}</p>
          </div>

          <div
            v-if="tx.hex && !isBroadcast"
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
          >
            <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                @click="closeEvent"
              >
                <span class="sr-only">Close</span>
                <XIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div class="text-center space-y-3 mb-3">
              <div v-if="!isLoaded" class="animate-pulse">
                <div class="rounded-full bg-gray-300 h-12 w-12 mx-auto"></div>
              </div>
              <img
                v-else
                :src="coin.logo"
                class="w-12 mx-auto"
                :alt="coin.ticker"
              />

              <DialogTitle
                as="h3"
                class="text-lg leading-6 text-center font-medium text-gray-900"
              >
                Confirm {{ ticker.toUpperCase() }} transaction
              </DialogTitle>
              <p class="text-sm">
                Are you sure you want to make this transaction?
              </p>
            </div>

            <div class="bg-gray-200 p-2 mb-3 rounded space-y-2">
              <p class="text-sm">
                Amount: {{ tx.amount }} {{ ticker.toUpperCase() }}
              </p>
              <p class="text-sm">
                Miner Fee: {{ tx.fee }} {{ ticker.toUpperCase() }}
              </p>
            </div>

            <div class="flex space-x-3 justify-center">
              <button
                @click="closeEvent"
                class="block w-full p-3 shadow-sm text-base font-medium rounded-md text-white bg-red-400 hover:bg-red-300 focus:outline-none"
              >
                <XIcon class="w-6 h-6 mx-auto" aria-hidden="true" />
              </button>

              <button
                @click="broadcastTx(ticker, tx.hex)"
                class="block w-full p-3 shadow-sm text-base font-medium rounded-md text-white bg-green-400 hover:bg-green-300 focus:outline-none"
              >
                <CheckIcon
                  v-if="!isSending"
                  class="w-6 h-6 mx-auto"
                  aria-hidden="true"
                />
                <img
                  v-else
                  class="mx-auto w-6"
                  src="@/assets/loading_spinner.svg"
                />
              </button>
            </div>
          </div>

          <div
            v-if="isBroadcast"
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
          >
            <div class="text-center space-y-3 mb-3">
              <div
                class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
              >
                <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>

              <DialogTitle
                as="h3"
                class="text-lg mb-3 leading-6 text-center font-medium text-gray-900"
              >
                Transaction was successful!
              </DialogTitle>

              <button
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-yellow-900 hover:bg-orange-400 sm:text-sm"
                @click="viewTx(ticker, tx.hash)"
              >
                View Transaction
              </button>

              <button
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-200 text-base font-medium text-gray-900 hover:bg-gray-300 sm:text-sm"
                @click="closeEvent"
              >
                Close
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionRoot,
} from "@headlessui/vue";
import { Coin, CoinFactory } from "@/class/coins";
import axios from "axios";
import ethWallet from "@/class/wallets/eth-wallet";
import Web3 from "web3";
import { XIcon, CheckIcon } from "@heroicons/vue/outline";
import btcP2wpkhWallet from "@/class/wallets/btc-p2wpkh-wallet";
import sb from "satoshi-bitcoin";
import { TransactionResult } from "@/class/wallets/abstract-wallet";

/*
This component should take in an address for a prop and showcase it, a QR code, and copy to clipboard button
*/

export default {
  props: {
    ticker: String,
  },
  emits: ["close"],
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionRoot,

    XIcon,
    CheckIcon,
  },
  data() {
    return {
      address: "",
      amount: "0",
    };
  },
  setup(props, { emit }) {
    const open = ref(true);
    const isEth = ref(false);
    const coin = ref({} as Coin);

    // ETH/BSC stuff
    const gasLimit = ref(21000); // 21k gas for standard transaction

    const selectedFee = ref(0);
    const selectedButton = ref(0);
    const userSelectedButton = ref(false);

    const isLoaded = ref(false);
    const sendMax = ref(false);

    const isSubmitted = ref(false);
    const isSending = ref(false);
    const isBroadcast = ref(false);

    const tx = ref({} as TransactionResult);

    interface Fee {
      speed: string;
      amount: string | number;
      format: string;
    }

    const fees: Fee[] = [];

    onMounted(async () => {
      coin.value = CoinFactory.getCoin(props.ticker);
      if (
        coin.value.network === "ethereum" ||
        coin.value.network === "binance"
      ) {
        isEth.value = true;

        // Going to be dealing with tokens, so set a higher gas limit
        if (coin.value.contract) {
          gasLimit.value = 100000;
        }
      }

      // Determine fees for network
      // BTC satoshis per byte gets fetched from https://api.blockchain.info/mempool/fees
      // ETH/BSC can be fetched from Metamask
      if (isEth.value) {
        const web3 = ethWallet.getWeb3(coin.value.network);
        const recommendedFee = await web3.eth.getGasPrice();

        fees.push({
          speed: "Average",
          amount: Web3.utils.fromWei(recommendedFee, "gwei"),
          format: "Gwei",
        });
      } else {
        const fee = await axios.get("https://api.blockchain.info/mempool/fees");

        fees.push(
          {
            speed: "Fast",
            amount: fee.data.priority,
            format: "Sats/b",
          },
          {
            speed: "Average",
            amount: fee.data.regular,
            format: "Sats/b",
          },
          {
            speed: "Slow",
            amount: fee.data.limits.min,
            format: "Sats/b",
          }
        );
      }

      isLoaded.value = true;
    });

    // Create a signed transaction
    const createTx = async (
      address: string,
      amount: number,
      sendMax: boolean
    ) => {
      isSubmitted.value = true;

      // If the coin is BTC-based, validate the address and convert the amount into Satoshis
      if (coin.value.network === "bitcoin") {
        const newAmount = sb.toSatoshi(amount);

        try {
          const signedTx = await btcP2wpkhWallet.createSignedTransaction(
            props.ticker,
            address,
            newAmount,
            selectedFee.value,
            sendMax
          );

          tx.value = signedTx;
          isSubmitted.value = false;
        } catch (e) {
          isSubmitted.value = false;
          console.log(e);
        }
      }

      // If the network is Ethereum or Binance
      if (
        coin.value.network === "ethereum" ||
        coin.value.network === "binance"
      ) {
        // Handle if the token has a contract (token)
        if (coin.value.contract) {
          const signedTx = await ethWallet.sendTokens(
            address,
            amount,
            coin.value.contract,
            selectedFee.value,
            gasLimit.value,
            coin.value.network
          );

          tx.value = signedTx;
        }
        // Otherwise its just a normal transfer
        else {
          const signedTx = await ethWallet.sendCoin(
            address,
            amount,
            selectedFee.value,
            gasLimit.value,
            coin.value.network
          );

          tx.value = signedTx;
        }
      }
    };

    // Open TXID in new tab
    const viewTx = (ticker, txid: string) => {
      const coin = CoinFactory.getCoin(ticker);
      window.open(`${coin.blockbook}/tx/${txid}`, "_blank");
    };

    // Broadcast the raw transaction to correct network
    const broadcastTx = async (ticker, hex: string) => {
      const coin = CoinFactory.getCoin(ticker); // Fetch coin data
      isSending.value = true;

      switch (coin.network) {
        // Broadcast to chain via Blockbook
        case "bitcoin": {
          const blockbook = btcP2wpkhWallet.createBlockbookClient(ticker);

          try {
            await blockbook.sendTx(hex);
          } catch (e) {
            console.error("[Error sending BTC-based TX]:", e);
            isSending.value = false;
          }

          isBroadcast.value = true;

          break;
        }

        // TODO: Tidy this up in future release
        // Broadcast to Ethereum or Binance Smart Chain via Web3
        case "ethereum": {
          const web3 = ethWallet.getWeb3(coin.network);

          try {
            const res = await web3.eth.sendSignedTransaction(tx.value.hex);
            console.log(res.transactionHash);
          } catch (e) {
            console.error("[Error sending ETH TX]:", e);
            isSending.value = false;
          }

          isBroadcast.value = true;

          break;
        }

        case "binance": {
          const web3 = ethWallet.getWeb3(coin.network);

          try {
            const res = await web3.eth.sendSignedTransaction(tx.value.hex);
            console.log(res.transactionHash);
          } catch (e) {
            console.error("[Error sending ETH TX]:", e);
            isSending.value = false;
          }

          isBroadcast.value = true;

          break;
        }

        default:
          break;
      }
    };

    // Set a fee (Satoshis for BTC, or Gwei for ETH)
    const setTxFee = (button, fee: number) => {
      selectedFee.value = fee;
      selectedButton.value = button;
      userSelectedButton.value = true;
    };

    // Toggle to send max amount
    const toggleSendMax = () => {
      sendMax.value = !sendMax.value;
    };

    // Handle close
    const closeEvent = () => {
      emit("close");
    };

    return {
      open,
      props,
      coin,
      isEth,
      fees,
      isLoaded,
      isSubmitted,
      selectedButton,
      userSelectedButton,

      gasLimit,

      sendMax,
      toggleSendMax,

      tx,
      isSending,
      isBroadcast,

      createTx,
      broadcastTx,
      viewTx,
      setTxFee,
      closeEvent,
    };
  },
};
</script>
