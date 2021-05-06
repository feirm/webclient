import { AbstractWallet } from "./abstract-wallet";
import Web3 from "web3";

import Common from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";
import Wallet, { hdkey } from "ethereumjs-wallet";
import { mnemonicToSeedSync } from "bip39";

// Here is the minimum ABI we need for interacting with ERC20 contracts
const erc20Abi: any = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

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
        const provider = this.determineProviderUrl(network, true);
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
    public determineProviderUrl(network: string, testnet: boolean): string {
        let providerUrl;

        switch (network) {
            case "eth": {
                if (testnet) {
                    providerUrl = "https://rinkeby-light.eth.linkpool.io";
                } else {
                    providerUrl = "https://main-light.eth.linkpool.io";
                }
                
                break;
            }
            case "bsc": {
                if (testnet) {
                    providerUrl = "https://bsc-dataseed.binance.org"
                } else {
                    providerUrl = "https://data-seed-prebsc-1-s1.binance.org:8545";
                }

                break;
            }
            default: {
                throw new Error("Network not valid!");
            }
        }

        // Return the provider
        return providerUrl;
    }

    // Determine common chain parameters
    public determineChainParameters(network: string, testnet: boolean): Common {
        let common;

        // Mainnet Binance Smart Chain
        if (network === 'binance' && !testnet) {
            common = Common.forCustomChain('mainnet', {
                name: 'Binance',
                networkId: 56,
                chainId: 56
            }, 'petersburg');
        }

        // Testnet Binance Smart Chain
        if (network === 'binance' && testnet) {
            common = Common.forCustomChain('mainnet', {
                name: 'Binance',
                networkId: 97,
                chainId: 97
            }, 'petersburg');
        }

        // Mainnet Ethereum
        if (network === 'ethereum' && !testnet) {
            common = new Common({ chain: 'mainnet' });
        }

        // Testnet Ethereum
        if (network === 'ethereum' && testnet) {
            common = new Common({ chain: 'rinkeby' })
        }

        return common;
    }

    // Normal transfer
    public async sendCoin(recipient: string, amount: string) {
        // Convert the amount from ether to Wei
        const value = Web3.utils.toWei(amount, "ether");

        // TODO: Fetch this data from somewhere...
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
            value: Web3.utils.toHex(value),
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
    public async sendTokens(recipient: string, amount: string, token: string) {
        // Convert the amount from ether to Wei
        const value = Web3.utils.toWei(amount, "ether");

        // Hardcoded address for XFE contract
        const tokenAddress = "0x6ebfe4b1674b0c7d45f3a2b898904b268b6f3b06";
        const contract = new this.web3.eth.Contract(erc20Abi, tokenAddress);

        // Fetch gas and nonce
        const gasPrice = await this.web3.eth.getGasPrice();
        const nonce = await this.web3.eth.getTransactionCount(this.wallet.getAddressString());

        const bsc = Common.forCustomChain('mainnet', {
            name: 'Binance',
            networkId: 97,
            chainId: 97
        }, 'petersburg');

        // Construct the transfer transaction
        const data = contract.methods.transfer(recipient, value).encodeABI();
        const tx = new Transaction({
            to: tokenAddress,
            value: 0x00,
            gasPrice: Web3.utils.toHex(gasPrice),
            gasLimit: Web3.utils.toHex(210000),
            nonce: Web3.utils.toHex(nonce),
            data: data
        }, { common: bsc });

        const signedTx = tx.sign(this.wallet.getPrivateKey());
        const rawTx = signedTx.serialize().toString('hex');

        const hash = await this.web3.eth.sendSignedTransaction('0x' + rawTx);
        alert(hash.transactionHash);
    }
}

export default new ETHWallet();