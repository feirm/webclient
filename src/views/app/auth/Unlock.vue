<template>
    <div>
        <h1>Unlock account</h1>
        <input type="password" v-model="encryptionKey">
        <button @click="decrypt">Unlock</button>
    </div>
</template>

<script lang="ts">
import account from "@/class/account";
import fbService from "@/service/api/fbService";
import { defineComponent } from "@vue/runtime-core";
import { mapGetters, useStore } from "vuex";

export default defineComponent({
    name: "Unlock",
    data() {
        return {
            encryptionKey: ""
        }
    },
    computed: {
        ...mapGetters([
            "getRefreshToken"
        ])
    },
    methods: {
        async decrypt() {
            try {
                // Fetch encrypted account from IDB
                const encryptedAccount = await account.fetchAccount();

                // Decrypt using encryption key
                const rootKey = await account.decryptRootKey(this.encryptionKey, encryptedAccount);
                account.setRootKey(rootKey);
            } catch (e) {
                return this.$toast.error("Failed to unlock your account!")
            }

            try {
                // Fetch refresh token and request for new access tokens
                const res = await fbService.getNewIdToken(this.getRefreshToken);
            
                const idToken = res.data.id_token;
                const refreshToken = res.data.refresh_token;

                // Update tokens in Vuex
                this.store.dispatch("login", { idToken, refreshToken });
            } catch (e) {
                console.log(e);
                return this.$toast.error("Unable to fetch access token!")
            }
        }
    },
    setup() {
        const store = useStore();

        return {
            store
        }
    }
})
</script>