<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2
          class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate"
        >
          My {{ coin.name }} Wallet
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
        <button
          @click="toggleReceivingAddressModal"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-gray-700 bg-white border-gray-300 hover:bg-gray-100"
        >
          <QrcodeIcon class="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
          Receive
        </button>

        <button
          @click="toggleSendModal"
          type="button"
          class="inline-flex items-center px-4 py-2 shadow-sm text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-400"
        >
          <ArrowCircleRightIcon class="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
          Send
        </button>
      </div>
    </div>
    <hr />

    <h1 class="text-3xl">{{ balance }} {{ ticker.toUpperCase() }}</h1>
  </div>

  <address-modal
    v-if="showAddressModal"
    :address="address"
    :ticker="ticker"
    @close="toggleReceivingAddressModal"
  />

  <send-modal v-if="showSendModal" :ticker="ticker" @close="toggleSendModal" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Coin, CoinFactory } from "@/class/coins";

// Components
import AddressModal from "@/components/AddressModal.vue";
import SendModal from "@/components/SendModal.vue";

// Other
import walletService from "@/service/api/walletService";
import account from "@/class/account";
import ethWallet from "@/class/wallets/eth-wallet";
import { EncryptedWallet } from "@/models/wallet";
import btcP2wpkhWallet from "@/class/wallets/btc-p2wpkh-wallet";
import sb from "satoshi-bitcoin";
import Web3 from "web3";

import { QrcodeIcon, ArrowCircleRightIcon } from "@heroicons/vue/outline";

export default defineComponent({
  name: "Wallet",
  components: {
    AddressModal,
    SendModal,

    QrcodeIcon,
    ArrowCircleRightIcon,
  },
  setup() {
    const route = useRoute();
    const ticker: string = route.params.ticker as string;

    const coin = ref({} as Coin);

    const balance = ref();
    const address = ref();

    const showAddressModal = ref(false);
    const showSendModal = ref(false);

    onMounted(async () => {
      coin.value = CoinFactory.getCoin(ticker);

      // Fetch and decrypt wallet
      const encryptedWallet: EncryptedWallet = await (
        await walletService.GetWallet()
      ).data;

      const rootKey = account.getRootKey();
      const mnemonic = await ethWallet.decryptWallet(rootKey, encryptedWallet);

      // Set the mnemonic for use with ETH/BSC and Bitcoin
      ethWallet.setMnemonic(mnemonic);
      btcP2wpkhWallet.setMnemonic(mnemonic);

      // Derive and set our receiving address depending on the coin/token
      if (coin.value.network === "bitcoin") {
        address.value = btcP2wpkhWallet.getAddress(ticker, 0, 0);
      } else if (
        coin.value.network === "ethereum" ||
        coin.value.network === "binance"
      ) {
        address.value = ethWallet.getWallet().getAddressString();
      }

      // Fetch balance data for Bitcoin, Ethereum/Binance tokens
      if (coin.value.network === "bitcoin") {
        console.log("[Wallet] Todo: Fetch wallet data for:", coin.value.name);
        const zpub = btcP2wpkhWallet.getZpub(coin.value.ticker);
        const data = await btcP2wpkhWallet.getXpubInfo(zpub, coin.value.ticker);

        balance.value = sb.toBitcoin(
          parseInt(data.balance) + parseInt(data.unconfirmedBalance)
        );
      } else if (
        coin.value.network === "ethereum" ||
        coin.value.network === "binance"
      ) {
        console.log("[Wallet] Todo: Fetch token data for:", coin.value.name);
        if (coin.value.contract) {
          const contract = ethWallet.getContract(
            coin.value.contract,
            coin.value.network
          );
          const contractBalance = await contract.methods
            .balanceOf(address.value)
            .call();

          balance.value = Web3.utils.fromWei(contractBalance, "ether");
        } else {
          const web3 = ethWallet.getWeb3(coin.value.network);
          const weiBalance = await web3.eth.getBalance(address.value);

          balance.value = Web3.utils.fromWei(weiBalance, "ether");
        }
      }
    });

    // Open receiving address modal
    const toggleReceivingAddressModal = () => {
      showAddressModal.value = !showAddressModal.value;
    };

    // Toggle send modal
    const toggleSendModal = () => {
      showSendModal.value = !showSendModal.value;
    };

    return {
      coin,
      ticker,
      address,
      balance,

      showAddressModal,
      showSendModal,

      toggleReceivingAddressModal,
      toggleSendModal,
    };
  },
});
</script>
