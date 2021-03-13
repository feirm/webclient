<template>
    <div class="min-h-screen relative flex items-center justify-center bg-gray-100">
        <!-- Signup form -->
        <div class="bg-white p-8 rounded shadow-2xl sm:w-1/2 md:w-1/2 lg:w-1/4">
            <router-link to="/">
                <img class="mx-auto w-16 mb-5" src="@/assets/img/logo.png" alt="Feirm Logo">
            </router-link>

            <h2 class="text-3xl font-light mb-4 text-center">Create your Feirm account</h2>

            <!-- Form -->
            <div>
                <!-- Username/email address -->
                <div>
                    <label class="block mb-2 font-light text-gray-500">Username or Email Address</label>
                    <input class="w-full mb-3 border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200" type="text" autofocus />
                </div>

                <!-- Password -->
                <div>
                    <label class="block mb-2 font-light text-gray-500">Password</label>
                    <input class="w-full mb-1 border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200" v-model="password" v-on:input="checkPassword" type="password" />
                    <meter class="mb-3" max="4" :value="passwordScore"></meter>
                </div>

                <!-- Signup button -->
                <button class="block w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300" :disabled="submitted">
                    <p v-if="!submitted">Sign up</p>
                    <img v-else class="mx-auto w-6" src="@/assets/loading_spinner.svg" alt="">
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import zxcvbn from "zxcvbn";

export default defineComponent({
  name: "Signup",
  data() {
    return {
        password: "",
        passwordScore: 0,
        submitted: false // Track whether or not a submission of account details have been made
    }
  },
  methods: {
      checkPassword() {
          // Calculate zxvbn score
          const score = zxcvbn(this.password).score;
          this.passwordScore = score;
      }
  }
});
</script>

<style>
/* Meter */
meter {
  /* Reset the default appearance */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  margin: 0 auto 1em;
  width: 100%;
  height: 0.5em;

  /* Applicable only to Firefox */
  background: none;
  background-color: rgba(0, 0, 0, 0.1);
}

meter::-webkit-meter-bar {
  background: none;
  background-color: rgba(0, 0, 0, 0.1);
}

/* Webkit based browsers */
meter[value="1"]::-webkit-meter-optimum-value { background: #EF4444; }
meter[value="2"]::-webkit-meter-optimum-value { background: #FCD34D; }
meter[value="3"]::-webkit-meter-optimum-value { background: #F59E0B; }
meter[value="4"]::-webkit-meter-optimum-value { background: #34D399; }

/* Gecko based browsers */
meter[value="1"]::-moz-meter-bar { background: #EF4444; }
meter[value="2"]::-moz-meter-bar { background: #FCD34D; }
meter[value="3"]::-moz-meter-bar { background: #F59E0B; }
meter[value="4"]::-moz-meter-bar { background: #34D399; }
</style>