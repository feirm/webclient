<template>
  <BaseModal :show="show" dismissFooter @close="$emit('close')">
    <div class="space-y-3">
      <h1 class="text-lg leading-6 font-medium text-gray-900">Error! 😟</h1>
      <p class="text-sm text-gray-500">
        {{ error }}
      </p>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseModal from "@/components/modals/BaseModal.vue";

export default defineComponent({
  name: "ErrorModal",
  components: {
    BaseModal,
  },
  props: {
    show: {
      type: Boolean,
    },
    error: {
      type: String,
    },
  },
});
</script>
