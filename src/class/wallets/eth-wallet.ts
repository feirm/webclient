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
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
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
        switch (network) {
            case "eth": {
                if (testnet) {
                    return "https://rinkeby-light.eth.linkpool.io";
                } else {
                    return "https://main-light.eth.linkpool.io";
                }
            }
            case "bsc": {
                if (testnet) {
                    return "https://data-seed-prebsc-1-s1.binance.org:8545";
                } else {
                    return "https://bsc-dataseed.binance.org"
                }
            }
            default: {
                throw new Error("Network not valid!");
            }
        }
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
    public async sendCoin(recipient: string, amount: string, network: string): Promise<string> {
        // Convert the amount from ether to Wei
        const value = Web3.utils.toWei(amount, "ether");

        const common = this.determineChainParameters(network, true);

        // Fetch gas and nonce
        const gasPrice = await this.web3.eth.getGasPrice();
        const nonce = await this.web3.eth.getTransactionCount(this.wallet.getAddressString());

        /*
        TODO: Ethereum will use legacy transaction format.
              Need to figure out how to use EIP-2930 standard for Berlin hardfork.
        */

        // Construct the transaction
        const tx = new Transaction({
            to: recipient,
            value: Web3.utils.toHex(value),
            gasPrice: Web3.utils.toHex(gasPrice),
            gasLimit: Web3.utils.toHex(210000),
            nonce: Web3.utils.toHex(nonce)
        }, { common });

        const signedTx = tx.sign(this.wallet.getPrivateKey());
        const rawTx = signedTx.serialize().toString('hex');

        const receipt = await this.web3.eth.sendSignedTransaction('0x' + rawTx);
        return receipt.transactionHash;
    }

    // Token transfer
    public async sendTokens(recipient: string, amount: string, tokenContract: string, network: string): Promise<string> {
        // Convert the amount from ether to Wei
        const value = Web3.utils.toWei(amount, "ether");

        const common = this.determineChainParameters(network, true);
        const contract = new this.web3.eth.Contract(erc20Abi, tokenContract);
        const address = this.wallet.getAddressString();

        // Fetch gas and nonce
        const gasPrice = await this.web3.eth.getGasPrice();
        const nonce = await this.web3.eth.getTransactionCount(address);

        // Construct the transfer transaction
        const data = contract.methods.transfer(recipient, value).encodeABI();
        const tx = new Transaction({
            to: tokenContract,
            value: 0x00,
            gasPrice: Web3.utils.toHex(gasPrice),
            gasLimit: Web3.utils.toHex(210000),
            nonce: Web3.utils.toHex(nonce),
            data: data
        }, { common });

        // Sign the transaction and serialise it for broadcasting
        const signedTx = tx.sign(this.wallet.getPrivateKey());
        const rawTx = signedTx.serialize().toString('hex');

        const receipt = await this.web3.eth.sendSignedTransaction('0x' + rawTx);
        return receipt.transactionHash;
    }
}

export default new ETHWallet();