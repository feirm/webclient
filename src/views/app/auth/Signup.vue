<template>
  <div
    class="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-600"
  >
    <!-- Signup form -->
    <div
      class="bg-gray-100 rounded p-8 shadow-2xl sm:w-1/2 md:w-1/2 lg:w-1/4"
    >
      <router-link to="/">
        <img
          class="mx-auto w-16 mb-5"
          src="@/assets/img/logo.png"
          alt="Feirm Logo"
        />
      </router-link>

      <!-- Step 0 (Get Started) -->
      <div v-if="formStep === 0">
        <h2 class="text-3xl font-light mb-4 text-center">
          Create your Feirm account
        </h2>
        <p class="font-light mb-2">Welcome! 👋</p>
        <p class="font-light mb-3">
          We are pleased to see that you want to sign up to the Feirm Platform.
          In order to get started though, we need a few pieces of information
          from you to create your account. We promise it'll be quick! 🚀
        </p>

        <button
          class="block w-full bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
          @click="nextStep()"
        >
          Get Started
        </button>
      </div>

      <!-- Step 1 (Username or Email Address) -->
      <div v-if="formStep === 1">
        <p class="font-bold text-gray-600 text-center">
          Step {{ formStep }} of {{ maxSteps }}
        </p>
        <h2 class="text-3xl font-light mb-4 text-center">Pick a username</h2>
        <p class="font-light mb-3">
          You can choose to sign up using a username or an email address. Using
          an email address will allow us to reset your account password if you
          forget it.
        </p>
        <div>
          <label class="block mb-2 font-light text-gray-500"
            >Username or Email Address</label
          >
          <input
            class="w-full mb-3 border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200"
            type="text"
            autofocus
          />

          <!-- Action buttons -->
          <div>
            <button
              class="inline float-left w-1/3 mr-2 bg-yellow-200 hover:bg-yellow-300 p-4 rounded text-yellow-900 transition duration-300"
              @click="previousStep()"
            >
              Back
            </button>
            <button
              class="inline float-right w-1/3 bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
              @click="nextStep()"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2 (Account password) -->
      <div v-if="formStep === 2">
        <p class="font-bold text-gray-600 text-center">
          Step {{ formStep }} of {{ maxSteps }}
        </p>
        <h2 class="text-3xl font-light mb-4 text-center">Create a password</h2>
        <p class="font-light mb-3">
          To secure your account, we need a password from you! Please be sure to
          make it strong! 💪
        </p>
        <div>
          <label class="block mb-2 font-light text-gray-500">Password</label>
          <input
            class="w-full mb-1 border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200"
            v-model="password"
            v-on:input="checkPassword"
            type="password"
          />
          <meter class="mb-3" max="4" :value="passwordScore"></meter>

          <!-- Action buttons -->
          <div>
            <button
              class="inline float-left w-1/3 mr-2 bg-yellow-200 hover:bg-yellow-300 p-4 rounded text-yellow-900 transition duration-300"
              @click="previousStep()"
            >
              Back
            </button>
            <button
              class="inline float-right w-1/3 bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
              @click="nextStep()"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3 (Encryption key) -->
      <div v-if="formStep === 3">
        <p class="font-bold text-gray-600 text-center">
          Step {{ formStep }} of {{ maxSteps }}
        </p>
        <h2 class="text-3xl font-light mb-4 text-center">
          Create an encryption key
        </h2>
        <p class="font-light mb-2">
          An encryption key is what the Feirm web application uses to protect
          your data. It is very important this key is different from your
          password and also that you remember it! 🧠
        </p>
        <p class="font-light mb-3">
          Feirm does not have access to this encryption key, nor do we have the
          ability to reset it!
        </p>
        <div>
          <label class="block mb-2 font-light text-gray-500"
            >Encryption Key</label
          >
          <input
            class="w-full mb-1 border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200"
            v-model="encryptionKey"
            v-on:input="checkEncryptionKey"
            type="password"
          />
          <meter class="mb-3" max="4" :value="encryptionKeyScore"></meter>

          <!-- Action buttons -->
          <div>
            <button
              class="inline float-left w-1/3 mr-2 bg-yellow-200 hover:bg-yellow-300 p-4 rounded text-yellow-900 transition duration-300"
              @click="previousStep()"
            >
              Back
            </button>
            <button
              class="inline float-right w-1/3 bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
              @click="nextStep()"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Step 4 (Confirm encryption key) -->
      <div v-if="formStep === 4">
        <p class="font-bold text-gray-600 text-center">
          Step {{ formStep }} of {{ maxSteps }}
        </p>
        <h2 class="text-3xl font-light mb-4 text-center">
          Confirm your encryption key
        </h2>
        <p class="font-light mb-3">
          Please confirm your encryption key again. We're just checking that
          you've still got it! 😉
        </p>
        <div>
          <label class="block mb-2 font-light text-gray-500"
            >Encryption Key</label
          >
          <input
            class="w-full mb-3 border-2 border-gray-200 p-3 rounded outline-none focus:border-orange-500 transition duration-200"
            v-model="confirmEncryptionKey"
            type="password"
          />

          <!-- Action buttons -->
          <div>
            <button
              class="inline float-left w-1/3 mr-2 bg-yellow-200 hover:bg-yellow-300 p-4 rounded text-yellow-900 transition duration-300"
              @click="previousStep()"
            >
              Back
            </button>

            <button
              class="inline float-right w-1/3 bg-orange-500 hover:bg-orange-400 p-4 rounded text-yellow-900 transition duration-300"
              :disabled="submitted"
            >
              <p v-if="!submitted">Submit</p>
              <img
                v-else
                class="mx-auto w-6"
                src="@/assets/loading_spinner.svg"
                alt=""
              />
            </button>
          </div>
        </div>
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
      // Multistep form
      formStep: 0,
      maxSteps: 4,

      // User account
      username: "",
      password: "",
      passwordScore: 0,

      // Encryption key
      encryptionKey: "",
      confirmEncryptionKey: "",
      encryptionKeyScore: 0,

      submitted: false // Track whether or not a submission of account details have been made
    };
  },
  methods: {
    // Increment the form step counter
    nextStep() {
      this.formStep++;
    },
    // Decrease the form step counter
    previousStep() {
      this.formStep--;
    },
    checkPassword() {
      // Calculate zxvbn score
      const score = zxcvbn(this.password).score;
      this.passwordScore = score;
    },
    checkEncryptionKey() {
      // Calculate zxvbn score
      const score = zxcvbn(this.encryptionKey).score;
      this.encryptionKeyScore = score;
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
  border-radius: 3px;
}

meter::-webkit-meter-bar {
  background: none;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

/* Webkit based browsers */
meter[value="1"]::-webkit-meter-optimum-value {
  background: #ef4444;
  border-radius: 3px;
}
meter[value="2"]::-webkit-meter-optimum-value {
  background: #fcd34d;
  border-radius: 3px;
}
meter[value="3"]::-webkit-meter-optimum-value {
  background: #f59e0b;
  border-radius: 3px;
}
meter[value="4"]::-webkit-meter-optimum-value {
  background: #34d399;
  border-radius: 3px;
}

/* Gecko based browsers */
meter[value="1"]::-moz-meter-bar {
  background: #ef4444;
  border-radius: 3px;
}
meter[value="2"]::-moz-meter-bar {
  background: #fcd34d;
  border-radius: 3px;
}
meter[value="3"]::-moz-meter-bar {
  background: #f59e0b;
  border-radius: 3px;
}
meter[value="4"]::-moz-meter-bar {
  background: #34d399;
  border-radius: 3px;
}
</style>
