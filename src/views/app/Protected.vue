<template>
  <div>
    <h1>Protected resource!</h1>
    {{ account }}
  </div>
</template>

<script lang="ts">
import account from "@/class/account";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Protected",
  data() {
    return {
      account: null
    }
  },
  async mounted() {
    this.account = await account.fetchAccount();
  }
});
</script>
