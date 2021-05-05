import { AbstractWallet } from "./abstract-wallet";
import HDWalletProvider from "@truffle/hdwallet-provider";

/**
 * A BIP-44 compatible wallet suitable for Ethereum and Binance Smart Chain
 * Derived from a BIP39 mnemonic
 */
class ETHWallet extends AbstractWallet {
    private address: string;

    public createProvider(network: string): HDWalletProvider {
        // Determine the provider URL based on the network
        let providerUrl;

        switch (network) {
            case "eth": {
                providerUrl = "https://main-light.eth.linkpool.io";
                break;
            }
            case "bsc": {
                providerUrl = "https://data-seed-prebsc-1-s1.binance.org:8545";
                break;
            }
            default: {
                throw new Error("Network not valid!");
            }
        }

        // Create a new HD provider using the mnemonic and URL determined
        const mnemonic = this.getMnemonic();

        const provider = new HDWalletProvider({
            mnemonic: mnemonic,
            providerOrUrl: providerUrl
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