<template>
    <div class="bg-gray-200">
    <div class="container p-8 md:p-16 w-full md:w-3/4 mx-auto space-y-3 md:space-y-6">
      <h1 class="text-4xl font-light text-left text-gray-900">Your wallets</h1>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 text-left">
        <!-- Feirm token -->
        <div class="p-4 bg-grey-100 space-y-2 shadow rounded">
          <h1 class="text-xl text-center font-light text-orange">Feirm (XFE)</h1>
          <p class="text-xs font-light text-center">Binance Smart Chain (BEP-20)</p>

          <div class="mx-auto">
              <div class="flex flex-row">
                  <button class="block p-3 rounded bg-orange-500 text-yellow-900">Deposit</button>
              </div>
              <div class="flex flex-row">
                  <button class="block p-3 rounded bg-orange-500 text-yellow-900">Withdraw</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup() {
        const router = useRouter();

        return {
            router
        }
    },
})
</script>
