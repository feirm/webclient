<template>
    <div class="flex p-4 w-full bg-gray-600">
        <div class="container space-x-4">
            {{ profile }}
        </div>
    </div>
</template>

<script lang="ts">
import authService from '@/service/api/authService';
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            profile: {} as any
        }
    },
    async mounted() {
        await authService.GetAccount().then(res => {
            this.profile = res.data;
        })
    }
})
</script>
