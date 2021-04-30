import { entropyToMnemonic, validateMnemonic } from "bip39";
import { v4 as uuidv4 } from "uuid";

export abstract class AbstractWallet {
    id: string; // Random UUID
    mnemonic: string; // BIP39 mnemonic

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
    public static generateMnemonic() {
        const entropy = window.crypto.getRandomValues(new Uint8Array(32));
        const entropyBytes = Buffer.from(entropy);

        const mnemonic = entropyToMnemonic(entropyBytes);
        return mnemonic;
    }

    // Return the 24-word mnemonic if we have it
    public getMnemonic(): string {
        return this.mnemonic;
    }
}