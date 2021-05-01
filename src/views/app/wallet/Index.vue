<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl leading-tight text-gray-900">
          My Wallet
        </h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const open = ref(false)

    return {
      open,
    }
  },
}
</script>