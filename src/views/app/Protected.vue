<template>
  <div>
    <h1>Protected resource!</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Protected",
  data() {
    return {
      account: ""
    };
  },
});
</script>
