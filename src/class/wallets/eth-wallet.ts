import { mnemonicToSeedSync } from "bip39";
import { AbstractWallet } from "./abstract-wallet";
import { hdkey } from "ethereumjs-wallet";

/**
 * A BIP-44 compatible wallet suitable for Ethereum and Binance Smart Chain
 * Derived from a BIP39 mnemonic
 */
class ETHWallet extends AbstractWallet {
    // Derive root key etc
    public getWallet(index: number) {
        // Convert mnemonic to seed
        const mnemonic = this.getMnemonic();
        const seed = mnemonicToSeedSync(mnemonic);

        // Derive root key
        const rootKey = hdkey.fromMasterSeed(seed);

        // Derive a wallet from node
        const path = "m/44'/60'/0'/0"; // Standard BIP-44
        const node = rootKey.derivePath(path).deriveChild(index);
        const wallet = node.getWallet();
        
        console.log(wallet.getAddressString());
        console.log(wallet.getPrivateKeyString());
    }
}

// Export a single instance of the ETH Wallet
export default new ETHWallet();