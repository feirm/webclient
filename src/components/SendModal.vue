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
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
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
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
          >
            <div>
              <div class="text-center space-y-3 mb-3">
                <DialogTitle
                  as="h3"
                  class="text-lg leading-6 font-medium text-gray-900"
                >
                  Send {{ props.ticker.toUpperCase() }}
                </DialogTitle>

                <div class="text-left space-y-2">
                  <!-- Recipient -->
                  <label
                    for="address"
                    class="block text-sm font-medium text-gray-700"
                    >Recipient Address</label
                  >
                  <div class="mt-1">
                    <input
                      type="text"
                      class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <!-- Amount -->
                  <label
                    for="amount"
                    class="block text-sm font-medium text-gray-700"
                    >Amount ({{ props.ticker.toUpperCase() }})</label
                  >
                  <div class="mt-1">
                    <input
                      type="number"
                      class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <!-- Transaction fee -->
                  <label
                    for="address"
                    class="block text-sm font-medium text-gray-700"
                    >Transaction Fee</label
                  >
                  <div class="flex mt-1 space-x-3 justify-center">
                    <button
                      v-for="i in ['Fast', 'Average', 'Slow']"
                      :key="i"
                      class="block w-full p-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:border-orange-500"
                    >
                      {{ i }}
                      <br />
                      <span class="text-sm">100 sats/b</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="space-y-2">
              <button
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-400 sm:text-sm"
                @click="open = false"
              >
                Send
              </button>

              <button
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-400 sm:text-sm"
                @click="closeEvent"
              >
                Cancel
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionRoot,
} from "@headlessui/vue";

/*
This component should take in an address for a prop and showcase it, a QR code, and copy to clipboard button
*/

export default {
  props: {
    ticker: String,
  },
  emits: ["close"],
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionRoot,
  },
  setup(props, { emit }) {
    const open = ref(true);

    onMounted(async () => {
      console.log("Send component mounted!");
      console.log(props.ticker);
    });

    // Handle close
    const closeEvent = () => {
      emit("close");
    };

    return {
      open,
      props,

      closeEvent,
    };
  },
};
</script>
