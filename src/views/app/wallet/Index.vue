<template>
    <div class="flex justify-center items-center m-6 md:m-12">
      <div class="container w-4/5 md:w-3/5 rounded-lg p-2 m-4 space-y-3">
        <h1 class="text-gray-900 text-center text-4xl pb-3">Here are your wallets.</h1>

        <div class="grid grid-cols-2 gap-2">
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-md text-white space-y-2" v-for="coin in coins" :key="coin.ticker">
            <h4 class="text-lg">{{ coin.name }}</h4>

            <img :src="coin.logo" class="w-12" />
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { CoinFactory } from '@/class/coins';
import { onMounted, ref } from 'vue';

const coins = ref([] as any);

onMounted(() => {
  coins.value = CoinFactory.coinsList;
})
</script>