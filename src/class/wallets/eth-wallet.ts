import { AbstractWallet } from "./abstract-wallet";
import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import { Provider } from "@truffle/hdwallet-provider/dist/constructor/types";

/**
 * A BIP-44 compatible wallet suitable for Ethereum and Binance Smart Chain
 * Derived from a BIP39 mnemonic
 */
class ETHWallet extends AbstractWallet {
    private address: string;
    private web3: Web3;

    public createProvider(network: string): Provider {
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

        // Create new Web3
        const web3 = new Web3(provider);
        this.web3 = web3;

        // Return the provider
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

    // Get address balance
    public async getBalance(): Promise<string> {
        const balance = await this.web3.eth.getBalance(this.address);
        return balance;
    }
}

// Export a single instance of the ETH Wallet
export default new ETHWallet();