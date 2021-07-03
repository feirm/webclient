<template>
  {{ codes }}
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    codes: String,
  },
  setup(props) {
    console.log(props.codes);
  },
});
</script>
