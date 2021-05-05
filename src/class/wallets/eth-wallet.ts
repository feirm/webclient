import { AbstractWallet } from "./abstract-wallet";
import Web3 from "web3";

import Common from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";
import Wallet, { hdkey } from "ethereumjs-wallet";
import { mnemonicToSeedSync } from "bip39";

/**
 * A BIP-44 compatible wallet suitable for Ethereum and Binance Smart Chain
 * Derived from a BIP39 mnemonic
 */
class ETHWallet extends AbstractWallet {
    private wallet: Wallet;
    private web3: Web3;

    public getWeb3(network: string) {
        // Cache hit
        if (this.web3) {
            return this.web3;
        }

        // Determine network provider
        const provider = this.determineProviderUrl(network);
        const web3 = new Web3(provider);

        this.web3 = web3;
        return web3;
    }

    public getWallet(): Wallet {
        // Convert mnemonic to seed
        const mnemonic = this.getMnemonic();
        const seed = mnemonicToSeedSync(mnemonic);

        // Derive root key
        const rootKey = hdkey.fromMasterSeed(seed);

        // Derive an account at 0th index
        const path = "m/44'/60'/0'/0";
        const account = rootKey.derivePath(path).deriveChild(0);

        const wallet = account.getWallet();
        this.wallet = wallet;

        return wallet;
    }

    // Determine the provider URL based on the network
    public determineProviderUrl(network: string): string {
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

        // Return the provider
        return providerUrl;
    }

    // Normal transfer
    public async sendCoin(recipient: string, amount: string) {
        const bsc = Common.forCustomChain('mainnet', {
            name: 'Binance',
            networkId: 97,
            chainId: 97
        }, 'petersburg');

        // Fetch gas and nonce
        const gasPrice = await this.web3.eth.getGasPrice();
        const nonce = await this.web3.eth.getTransactionCount(this.wallet.getAddressString());

        // Construct the transaction]
        const tx = new Transaction({
            to: recipient,
            value: Web3.utils.toHex(amount),
            gasPrice: Web3.utils.toHex(gasPrice),
            gasLimit: Web3.utils.toHex(210000),
            nonce: Web3.utils.toHex(nonce)
        }, { common: bsc });

        const signedTx = tx.sign(this.wallet.getPrivateKey());
        const rawTx = signedTx.serialize().toString('hex');

        const hash = await this.web3.eth.sendSignedTransaction('0x' + rawTx);
        alert(hash.transactionHash);
    }

    // Token transfer
}

export default new ETHWallet();