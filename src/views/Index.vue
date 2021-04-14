<template>
  <div class="min-h-screen flex flex-col">
    <!-- Landing hero -->
  <div class="flex-grow p-10 sm:p-40 bg-grey-500">
    <div>
      <h1
        class="md:w-2/4 mx-auto text-4xl text-center font-light md:text-6xl mb-10 text-orange"
      >
        An ecosystem where privacy is for everyone.
      </h1>
      <p class="md:w-1/3 mx-auto text-2xl font-light text-center text-gray-100">
        A blockchain project and platform built for your privacy. Take a deep
        dive into the Feirm Ecosystem and experience the ultimate privacy and
        security provided by design.
      </p>
    </div>
  </div>

  <!-- Features container -->
  <div class="bg-grey-100">
    <div class="container p-8 md:p-16 w-full md:w-3/4 mx-auto space-y-4 md:space-y-12">
      <h1 class="text-4xl font-light text-center text-gray-900">What do we have to offer?</h1>

      <!-- Feature grids -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-12 text-left">
        <div class="p-4 space-y-2">
          <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <h1 class="text-2xl font-light text-center text-orange">Non-custodial web wallet</h1>
          <p>Not your keys, not your coins. With Feirm and our non-custodial wallet, you remain in complete control of your cryptocurrency.</p>
        </div>

        <div class="p-4 space-y-2">
          <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <h1 class="text-2xl font-light text-center text-orange">Ultimate security</h1>
          <p>When you create a Feirm account, it is protected with two-factor authentication and heavily secured using zero-knowledge encryption.</p>
        </div>

        <div class="p-4 space-y-2">
          <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 class="text-2xl font-light text-center text-orange">Available for everyone</h1>
          <p>We really do want privacy to be available for everyone. The Feirm Platform can be accessed on any device with a web browser - no need to install smartphone apps!</p>
        </div>

        <div class="p-4 space-y-2">
          <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          <h1 class="text-2xl font-light text-center text-orange">Open source</h1>
          <p>Trust is important, but never good enough. The Feirm web client is open source for everyone to see and audit its functionality.</p>
        </div>

        <div class="p-4 space-y-2">
          <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
          <h1 class="text-2xl font-light text-center text-orange">No ads or trackers</h1>
          <p>We aren't in the business of serving advertisements or violating user privacy by tracking their every move.</p>
        </div>

        <div class="p-4 space-y-2">
          <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
          <h1 class="text-2xl font-light text-center text-orange">Anonymity</h1>
          <p>Everyone deserves the right to remain anonymous online. All you need to get started is a username. No need for email addresses or phone numbers.</p>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Index"
});
</script>
