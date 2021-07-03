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
        <TransitionChild as="template">
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
        <TransitionChild as="template">
          <div
            class="inline-block align-bottom bg-white rounded-md px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          >
            <div class="space-y-4">
              <h1 class="text-2xl text-center">Recovery Codes</h1>

              <div class="flex space-x-4">
                <div class="border p-2 w-2/6 rounded">
                  <p
                    class="text-center font-mono"
                    v-for="code in codes"
                    :key="code"
                  >
                    {{ code }}
                  </p>
                </div>

                <div class="flex-1 text-sm space-y-3">
                  <p>
                    Be sure to keep these recovery codes for your Feirm account.
                    If you lose access to your primary two-factor device, these
                    will be used as a fallback.
                  </p>

                  <p>
                    We recommend writing these codes down with pen & paper and
                    storing them in a safe, or making a digital copy and keeping
                    them in a password manager such as Bitwarden.
                  </p>
                </div>
              </div>

              <button
                class="block w-full p-2 rounded-md text-yellow-900 bg-orange-500 hover:text-gray-100 hover:bg-grey-500 transition duration-300 ease-in-out focus:outline-none"
                @click="closeEvent"
              >
                Done
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

export default defineComponent({
  props: {
    codes: String,
  },
  components: {
    Dialog,
    DialogOverlay,
    TransitionChild,
    TransitionRoot,
  },
  setup(props, { emit }) {
    const open = ref(true);

    // Handle close
    const closeEvent = () => {
      emit("close");
    };

    return {
      open,
      closeEvent,
    };
  },
});
</script>
