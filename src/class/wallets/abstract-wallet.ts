import { v4 as uuidv4 } from "uuid";

export abstract class AbstractWallet {
    id: string; // Random UUID
    mnemonic: string; // BIP39 mnemonic

    // Get wallet ID
    public async getId() {
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
}