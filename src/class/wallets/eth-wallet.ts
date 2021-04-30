import { mnemonicToSeedSync } from "bip39";
import { AbstractWallet } from "./abstract-wallet";
import Wallet, { hdkey } from "ethereumjs-wallet";

/**
 * A BIP-44 compatible wallet suitable for Ethereum and Binance Smart Chain
 * Derived from a BIP39 mnemonic
 */
class ETHWallet extends AbstractWallet {
    private address: string;

    // Derive root key etc
    public getWallet(): Wallet {
        // Convert mnemonic to seed
        const mnemonic = this.getMnemonic();
        const seed = mnemonicToSeedSync(mnemonic);

        // Derive root key
        const rootKey = hdkey.fromMasterSeed(seed);

        // Derive a wallet from node
        const path = "m/44'/60'/0'/0"; // Standard BIP-44
        const node = rootKey.derivePath(path).deriveChild(0);

        const wallet = node.getWallet();
        return wallet;
    }

    // Set address
    public setAddress(address: string) {
        this.address = address;
    }

    // Get address
    public getAddress(): string {
        return this.address
    }
}

// Export a single instance of the ETH Wallet
export default new ETHWallet();