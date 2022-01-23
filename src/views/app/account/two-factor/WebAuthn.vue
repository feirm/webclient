<template>
    <div>
        <input type="text" v-model="deviceName" placeholder="Device Name">
        <b-button @click="registerWebAuthn">Register Device</b-button>

        <p>{{ response }}</p>
    </div>
</template>

<script setup lang="ts">
import authService from '@/service/api/authService';
import { ref } from 'vue';

const deviceName = ref();
const response = ref();

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Function to register a WebAuthn device
const registerWebAuthn = async () => {
    // Fetch challenge to sign
    let credentialCreationOptions;
    await authService.GetWebAuthnChallenge().then(async res => {
      credentialCreationOptions = res.data.register;

      // Need to convert some properties from base64 to ArrayBuffer
      credentialCreationOptions.publicKey.challenge = Buffer.from(credentialCreationOptions.publicKey.challenge, 'base64');
      credentialCreationOptions.publicKey.user.id = Buffer.from(credentialCreationOptions.publicKey.user.id, 'base64');
    });

    await navigator.credentials.create(credentialCreationOptions).then(c => {
        const credential = c as any;

        const attestationObject = credential.response.attestationObject;
        const clientDataJSON = credential.response.clientDataJSON;
        const rawId = credential.rawId;

        const cr = JSON.stringify({
          id: credential.id,
          rawId: arrayBufferToBase64(rawId),
          type: credential.type,
          response: {
            attestationObject: arrayBufferToBase64(attestationObject),
            clientDataJSON: arrayBufferToBase64(clientDataJSON)
          }
        });

        response.value = cr;
    })
}
</script>