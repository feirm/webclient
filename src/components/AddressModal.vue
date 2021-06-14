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
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          >
            <div class="sm:flex sm:items-start">
              <div class="mt-3 sm:mt-0 sm:text-left space-y-4">
                <DialogTitle
                  as="h3"
                  class="text-lg text-center leading-6 font-medium text-gray-900"
                >
                  Your cryptocurrency address
                </DialogTitle>

                <!-- QR Code -->
                <div>
                  <img
                    class="w-32 h-32 mx-auto"
                    :src="addressData.qr"
                    :alt="addressData.string"
                  />
                </div>

                <!-- Address -->
                <div>
                  <div class="flex rounded-md shadow-sm">
                    <div class="relative flex items-stretch flex-grow">
                      <input
                        disabled
                        type="text"
                        name="address"
                        class="block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                        :value="addressData.string"
                      />
                    </div>
                    <button
                      @click="copyToClipboard(addressData.string)"
                      class="-ml-px w-28 relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50"
                      :class="copied ? 'bg-green-200' : ''"
                    >
                      <ClipboardCopyIcon class="h-5 w-5" aria-hidden="true" />
                      <span>{{ copied ? "Copied" : "Copy" }}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <p class="text-sm text-gray-500">
                    Send your funds to the cryptocurrency address above. Any new
                    transfers will show up in your wallet immediately.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-400 sm:ml-3 sm:w-auto sm:text-sm"
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
import { onMounted, reactive, ref } from "vue";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ClipboardCopyIcon } from "@heroicons/vue/outline";
import qrcode from "qrcode";

/*
This component should take in an address for a prop and showcase it, a QR code, and copy to clipboard button
*/

export default {
  props: {
    address: String,
  },
  emits: ["close"],
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,

    ClipboardCopyIcon,
  },
  setup(props, { emit }) {
    const open = ref(true);
    const copied = ref(false);

    const addressData = reactive({
      string: "",
      qr: "",
    });

    onMounted(async () => {
      // Create QR code of address value
      const qrCode = await qrcode.toDataURL(props.address, {
        width: 256,
        height: 256,
      });

      // Set address and QR
      addressData.string = props.address;
      addressData.qr = qrCode;
    });

    // Copy the address to clipboard
    const copyToClipboard = async (address: string) => {
      if (!navigator.clipboard) {
        throw new Error("Unable to access clipboard!");
      }

      try {
        await navigator.clipboard.writeText(address);
        copied.value = true;

        // Reset copy status after 1 second
        setTimeout(() => {
          copied.value = false;
        }, 1000);
      } catch (e) {
        throw new Error(e);
      }
    };

    // Handle close
    const closeEvent = () => {
      emit("close");
    };

    return {
      open,
      addressData,
      copied,

      copyToClipboard,
      closeEvent,
    };
  },
};
</script>
