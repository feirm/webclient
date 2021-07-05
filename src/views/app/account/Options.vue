<template>
  <div class="flex p-4 space-x-4 justify-center">
    <div class="w-2/12">
      <SideNav />
    </div>
    <div class="container w-full md:w-2/5 border rounded-md p-4 space-y-3">
      <h1 class="text-3xl font-light">Options</h1>
      <p>
        Make some changes which affect the way the Feirm Platform runs on your
        device.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/account/SideNav.vue";

export default defineComponent({
  components: {
    SideNav,
  },
});
</script>
