<template>
  <BaseModal :show="show" @ok="doLogout" okFooter>
    <div class="space-y-2">
      <h1 class="text-xl">Are you sure you want to log out?</h1>
      <p class="text-sm">
        You are about to log out from your Feirm account on this device. We
        recommend users do this if this device is shared with others.
      </p>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    BaseModal,
  },
  props: {
    show: {
      type: Boolean,
    },
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const doLogout = () => {
      store.dispatch("logout");
      router.push({ path: "/" });
    };

    return {
      doLogout,
    };
  },
});
</script>
