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

// Function to register a WebAuthn device
const registerWebAuthn = async () => {
    // Fetch a generated challenge to be signed
    let credentialCreationOptions: PublicKeyCredentialCreationOptions;
    let token: string;

    try {
      await authService.GetWebAuthnChallenge().then(res => {
        credentialCreationOptions = res.data.register;
        token = res.data.token;

        // Challenge and User ID needs to be converted from Base64 to an ArrayBuffer
        const textEncode = new TextEncoder();
        credentialCreationOptions.challenge = textEncode.encode(res.data.register.challenge);
        credentialCreationOptions.user.id = textEncode.encode(res.data.register.user.id);
      });
    } catch (e) {
      console.log(e);
    }

    // Sign the credential and construct a payload to be sent back to server
    try {
      const credential = await navigator.credentials.create({ publicKey: credentialCreationOptions }) as PublicKeyCredential;
      const attestationResponse = credential.response as AuthenticatorAttestationResponse;

      const deviceResponse = {
        id: credential.id,
        rawId: Buffer.from(credential.rawId).toString('base64') ,
        type: credential.type,
        response: {
          attestationObject: Buffer.from(attestationResponse.attestationObject).toString('base64'),
          clientDataJSON: Buffer.from(attestationResponse.clientDataJSON).toString('base64')
        }
      }

      const payload = {
        name: deviceName.value,
        token: token,
        deviceResponse: deviceResponse
      }

      console.log(payload)

    } catch (e) {
      console.log(e);
    }
}
</script>