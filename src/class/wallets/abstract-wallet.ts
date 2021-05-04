import bufferToHex from "@/helpers/bufferToHex";
import { EncryptedWallet } from "@/models/wallet";
import { entropyToMnemonic, validateMnemonic } from "bip39";
import { v4 as uuidv4 } from "uuid";

import account from "../account";
import { DB } from "../db";

export abstract class AbstractWallet extends DB {
    private id: string; // Random UUID
    private mnemonic: string; // BIP39 mnemonic

    // Get wallet ID
    public getId() {
        // Cache hit
        if (this.id) {
            return this.id;
        }

        const uuid = uuidv4();
        this.id = uuid;

        return uuid;
    }

    // Set a wallet ID
    public setId(id: string) {
        this.id = id;
    }

    // Set a mnemonic
    public setMnemonic(mnemonic: string) {
        // Validate the mnemonic
        const valid = validateMnemonic(mnemonic);
        if (!valid) {
            throw new Error("The mnemonic is invalid!");
        }

        this.mnemonic = mnemonic;
    }

    // Generate a 24-word mnemonic
    public generateMnemonic(): string {
        const entropy = window.crypto.getRandomValues(new Uint8Array(32));
        const entropyBytes = Buffer.from(entropy);

        const mnemonic = entropyToMnemonic(entropyBytes);
        return mnemonic;
    }

    // Return the 24-word mnemonic if we have it
    public getMnemonic(): string {
        return this.mnemonic;
    }

    // Encrypt wallet using account encryption key
    public async encrypt(rootKey: Uint8Array): Promise<EncryptedWallet> {
        // Derive encryption key from root key and also an IV
        const encryptionKey = await account.deriveEncryptionKey(rootKey);
        const iv = window.crypto.getRandomValues(new Uint8Array(16));

        // Convert the mnemonic to bytes
        const mnemonicBytes = new TextEncoder().encode(this.getMnemonic());

        // Construct encrypted wallet payload
        const wallet = {
            id: this.getId(),
            iv: bufferToHex(iv),
        } as EncryptedWallet;

        // Encrypt the mnemonic with AES-256-CBC
        const ciphertext = await window.crypto.subtle.encrypt(
            { name: "AES-CBC", iv: iv },
            encryptionKey,
            mnemonicBytes
        );
  
        // Sign the ciphertext with our identity key
        const keypair = await account.deriveIdentityKeypair(rootKey);
        const signature = await account.signMessage(keypair, bufferToHex(ciphertext));

        wallet.ciphertext = bufferToHex(ciphertext);
        wallet.signature = signature;

        return wallet;
    }

    // Decrypt wallet to return mnemonic
    public async decryptWallet(rootKey: Uint8Array, wallet: EncryptedWallet): Promise<string> {
        // Reconstruct encryption key and convert some properties to buffer form
        const encryptionKey = await account.deriveEncryptionKey(rootKey);
        const iv = Buffer.from(wallet.iv, 'hex');

        const mnemonicBytes = Buffer.from(wallet.ciphertext, 'hex');

        // Decrypt the wallet
        const decryptWallet = await window.crypto.subtle.decrypt(
            { name: "AES-CBC", iv: iv },
            encryptionKey,
            mnemonicBytes
        );

        // Convert from buffer to utf-8 readable
        const mnemonic = new TextDecoder().decode(decryptWallet)
        return mnemonic;
    }

    // Save encrypted wallet to IndexedDB
    public async saveToDisk(wallet: EncryptedWallet) {
        // Remove existing wallets before adding the new one
        await this.wallets.clear();
        await this.wallets.add(wallet, wallet.id);
    }
}