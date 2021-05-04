import { AbstractWallet } from "./abstract-wallet";
import HDWalletProvider from "@truffle/hdwallet-provider";

/**
 * A BIP-44 compatible wallet suitable for Ethereum and Binance Smart Chain
 * Derived from a BIP39 mnemonic
 */
class ETHWallet extends AbstractWallet {
    private address: string;

    // Derive root key etc
    public getWallet(): HDWalletProvider {
        // Create a new HDWalletProvider
        const mnemonic = this.getMnemonic();

        const provider = new HDWalletProvider({
            mnemonic: mnemonic,
            providerOrUrl: "https://bsc-dataseed.binance.org"
        });
        
        return provider;
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