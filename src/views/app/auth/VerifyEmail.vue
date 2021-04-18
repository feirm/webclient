<template>
    <p>{{ message }}</p>
</template>

<script lang="ts">
import authService from '@/service/api/authService';
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            message: "Verifying email address..."
        }
    },
    async mounted() {
        // Extract token from route URL
        const token = this.$route.query.token;

        // Send token to API
        await authService.VerifyEmail(token).then(res => {
            if (res.status === 200) {
                this.message = "Email verified. You can close this tab.";
            }
        }).catch(e => {
            this.message = e.response.data.error;
        })
    }
})
</script>
