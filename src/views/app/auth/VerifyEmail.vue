<template>
    <div
    class="min-h-screen relative flex items-center justify-center bg-grey-500"
  >
    <!-- Email verification -->
    <div class="bg-gray-100 h-screen p-8 shadow-2xl sm:w-1/2 md:w-1/2 lg:w-1/4 sm:rounded md:rounded lg:rounded sm:h-full md:h-full lg:h-full">
      <router-link to="/">
        <img
          class="mx-auto w-16 mb-5"
          src="@/assets/img/logo.png"
          alt="Feirm Logo"
        />
      </router-link>

      <div>
        <h2 class="text-3xl font-light mb-5 text-center">Verifying your email...</h2>
        <img v-show="!verified" class="mx-auto w-24" src="@/assets/loading_spinner_dark.svg" alt="Loading Spinner"/>

        <img v-show="verified" class="mx-auto w-24" src="@/assets/check_tick.svg" alt="Checkmark"/>
        <p v-show="verified" class="text-center mt-5">Your email has been verified! Feel free to close this tab.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import axios from "axios";

export default defineComponent({
    name: "VerifyEmail",
    data() {
        return {
            verified: false
        }
    },
    async mounted() {
        // Email verification is a one off, so I think it's
        // acceptable to put all the axios stuff here.
        const API_KEY = "AIzaSyBKPqBFtNyw_P1kdz48JTW2Zqm5Vvrn8E0";

        // Extract OobCode from route query
        const oobCode = this.$route.query.oobCode;

        try {
            // Submit OobCode to Firebase API
            const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`, {
                oobCode: oobCode
            });

            // Set email verification state
            const emailVerified = response.data.emailVerified;
            this.verified = emailVerified;
        } catch (e) {
            // Handle this later
            console.log(e);
        }
    }
})
</script>