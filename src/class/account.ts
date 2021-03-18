import bufferToHex from "@/helpers/bufferToHex";
import { EncryptedKey } from "@/models/account";
import { ArgonType, hash } from "argon2-browser";

class Account {
    public rootKey: Uint8Array;

    // Set account root key
    setRootKey(rootKey: Uint8Array) {
        this.rootKey = rootKey;
    }

    // Generate an encrypted root key
    async generateEncryptedRootKey(password: string): Promise<EncryptedKey> {
        // Generate some salt to be used when stretching the encryption key, and an IV for the encryption itself
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(16));

        // Generate a root key for the account
        const rootKey = window.crypto.getRandomValues(new Uint8Array(32));

        // Derive stretched key from encryption key
        const stretchedKey = await hash({
            pass: password,
            salt: salt,
            type: ArgonType.Argon2id,
            hashLen: 32
        });

        // Derive an encryption key to encrypt the root key with
        const encryptionKey = await window.crypto.subtle.importKey('raw', stretchedKey.hash, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']);

        // Encrypt the root key with the newly created encryption key
        const ciphertext = await window.crypto.subtle.encrypt({ name: 'AES-CBC', iv: iv }, encryptionKey, rootKey);

        const key = {
            key: bufferToHex(ciphertext),
            iv: bufferToHex(iv),
            salt: bufferToHex(salt)
        } as EncryptedKey;

        return key;
    }

}

export default new Account();