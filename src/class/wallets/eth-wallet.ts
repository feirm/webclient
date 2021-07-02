import { AbstractWallet, TransactionResult } from "./abstract-wallet";
import Web3 from "web3";

import Common from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";
import Wallet, { hdkey } from "ethereumjs-wallet";
import { mnemonicToSeedSync } from "bip39";
import { AbiItem } from "web3-utils";

// Here is the minimum ABI we need for interacting with ERC20 contracts
const erc20Abi: AbiItem[] = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    type: "function",
  },
];

/**
 * A BIP-44 compatible wallet suitable for Ethereum and Binance Smart Chain
 * Derived from a BIP39 mnemonic
 */
class ETHWallet extends AbstractWallet {
  private wallet: Wallet;
  private web3: Map<string, Web3> = new Map();

  /*
   * Web3.js methods
   */

  // Check to see if a Web3 connection exists for a network
  // If it does, return it
  // If it doesn't, create one and add it to the map
  public getWeb3(network: string) {
    // Check if Web3 connection is active for network
    let web3 = this.web3.get(network);
    if (web3) {
      return web3;
    }

    // Need to create a Web3 connection
    const providerUrl = this.determineProviderUrl(network, false); // mainnet = false, testnet = true
    web3 = new Web3(providerUrl);

    // Add connection to map and return it
    this.web3.set(network, web3);
    return web3;
  }

  // Determine common chain parameters
  public determineChainParameters(network: string, testnet: boolean): Common {
    let common;

    // Mainnet Binance Smart Chain
    if (network === "binance" && !testnet) {
      common = Common.forCustomChain(
        "mainnet",
        {
          name: "Binance",
          networkId: 56,
          chainId: 56,
        },
        "petersburg"
      );
    }

    // Testnet Binance Smart Chain
    if (network === "binance" && testnet) {
      common = Common.forCustomChain(
        "mainnet",
        {
          name: "Binance",
          networkId: 97,
          chainId: 97,
        },
        "petersburg"
      );
    }

    // Mainnet Ethereum
    if (network === "ethereum" && !testnet) {
      common = new Common({ chain: "mainnet" });
    }

    // Testnet Ethereum
    if (network === "ethereum" && testnet) {
      common = new Common({ chain: "rinkeby" });
    }

    return common;
  }

  // Get ERC20 contract from Web3
  public getContract(address: string, network: string) {
    const web3 = this.getWeb3(network);
    const contract = new web3.eth.Contract(erc20Abi, address);
    return contract;
  }

  /*
   * Wallet methods
   */

  // Derive a ETH wallet from mnemonic
  public getWallet(): Wallet {
    // Cache hit
    if (this.wallet) {
      return this.wallet;
    }

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
      case "ethereum": {
        if (testnet) {
          return "https://rinkeby-light.eth.linkpool.io";
        } else {
          return "https://mainnet.infura.io/v3/72f419fde281435a8ecbbbba19673f35";
        }
      }
      case "binance": {
        if (testnet) {
          return "https://data-seed-prebsc-1-s1.binance.org:8545";
        } else {
          return "https://bsc-dataseed.binance.org";
        }
      }
      default: {
        throw new Error("Network not valid!");
      }
    }
  }

  // Normal transfer
  public async sendCoin(
    recipient: string,
    amount: number,
    gasPrice: number,
    gasLimit: number,
    network: string
  ): Promise<TransactionResult> {
    // Fetch Web3 connection for network
    const web3 = this.getWeb3(network);

    const value = Web3.utils.toWei(amount.toString(), "ether");
    const common = this.determineChainParameters(network, false);
    const address = this.wallet.getAddressString();

    // Fetch nonce
    const nonce = await web3.eth.getTransactionCount(address);

    // Convert the gas price from gwei to wei
    const gasPriceWei = Web3.utils.toWei(gasPrice.toString(), "Gwei");

    // Construct the transaction
    const tx = new Transaction(
      {
        to: recipient,
        value: Web3.utils.toHex(value),
        gasPrice: Web3.utils.toHex(gasPriceWei),
        gasLimit: Web3.utils.toHex(gasLimit),
        nonce: Web3.utils.toHex(nonce),
      },
      { common }
    );

    const signedTx = tx.sign(this.wallet.getPrivateKey());
    const rawTx = signedTx.serialize().toString("hex");

    const result: TransactionResult = {
      hash: signedTx.hash().toString("hex"),
      hex: "0x" + rawTx,
      recipient: recipient,
      amount: amount,
      fee: Web3.utils.fromWei(signedTx.getBaseFee(), "Gwei"),
    };

    return result;
  }

  // Token transfer
  // Gas price is converted from gwei to gwei
  public async sendTokens(
    recipient: string,
    amount: number,
    tokenContract: string,
    gasPrice: number,
    gasLimit: number,
    network: string
  ): Promise<TransactionResult> {
    // Get Web3 connection
    const web3 = this.getWeb3(network);

    // Convert the amount from ether to Wei
    const value = Web3.utils.toWei(amount.toString(), "ether");

    const common = this.determineChainParameters(network, false);
    const contract = new web3.eth.Contract(erc20Abi, tokenContract);
    const address = this.wallet.getAddressString();

    // Fetch nonce
    const nonce = await web3.eth.getTransactionCount(address);

    // Convert the gas price from gwei to wei
    const gasPriceWei = Web3.utils.toWei(gasPrice.toString(), "Gwei");

    // Construct the transfer transaction
    const data = contract.methods.transfer(recipient, value).encodeABI();
    const tx = new Transaction(
      {
        to: tokenContract,
        value: 0x00,
        gasPrice: Web3.utils.toHex(gasPriceWei),
        gasLimit: Web3.utils.toHex(gasLimit),
        nonce: Web3.utils.toHex(nonce),
        data: data,
      },
      { common }
    );

    // Sign the transaction and serialise it for broadcasting
    const signedTx = tx.sign(this.wallet.getPrivateKey());
    const rawTx = signedTx.serialize().toString("hex");

    const result: TransactionResult = {
      hash: signedTx.hash().toString("hex"),
      hex: "0x" + rawTx,
      recipient: recipient,
      amount: amount,
      fee: Web3.utils.fromWei(signedTx.getBaseFee(), "Gwei"),
    };

    return result;
  }
}

export default new ETHWallet();
