<template>
  <BaseModal :show="show" dismissFooter @dismiss="$emit('dismiss')">
    <div class="space-y-3">
      <h1 class="text-2xl">Error! 😟</h1>
      <p class="text-sm">
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
