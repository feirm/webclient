<template>
    <div class="min-h-screen relative flex items-center justify-center bg-gray-100">
        <!-- Signup form -->
        <div class="bg-white p-8 rounded shadow-2xl sm:w-1/2 md:w-1/2 lg:w-1/4">
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
                    <input class="w-full mb-5 border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200" type="password" />
                </div>

                <!-- Signup button -->
                <button class="block w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300">Sign up</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Signup",
});
</script>