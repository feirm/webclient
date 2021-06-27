import { fromBase58, fromSeed } from "bip32";
import { mnemonicToSeedSync } from "bip39";
import { ECPair, payments, Psbt } from "bitcoinjs-lib";
import { CoinFactory } from "../coins";
import b58 from "bs58check";
import { BTCWallet } from "./btc-abstract-wallet";

class BTCP2WPKHWallet extends BTCWallet {
  private xpub: string;
  private zpub: string;

  setXpub(xpub: string) {
    this.xpub = xpub;
  }

  setZpub(zpub: string) {
    this.zpub = zpub;
  }

  getZpub(ticker: string) {
    // Find coin
    const coin = CoinFactory.getCoin(ticker);

    const mnemonic = this.getMnemonic();
    const seed = mnemonicToSeedSync(mnemonic);
    const root = fromSeed(seed, coin.network_data); // Always going to be 1st network

    // Only supporting Bitcoin BIP-84 (native segwit)
    const master = root.derivePath("m/84'/" + coin.bip_coin_type + "'/0'");
    const zpub = master.neutered().toBase58();

    return zpub;
  }

  // BitcoinJS doesn't like ZPUBs, YPUBs or VPUBs, so convert one into an XPUB
  getXpub(ticker, zpub: string): string {
    // Cache hit
    if (this.xpub) {
      return this.xpub;
    }

    if (!zpub) {
      throw new Error("Need to provide ZPUB!");
    }

    const coin = CoinFactory.getCoin(ticker);

    let buffer = b58.decode(zpub);
    buffer = buffer.slice(4);

    // Handle testnet different to mainnet
    if (coin.testnet) {
      buffer = Buffer.concat([Buffer.from("045f1cf6", "hex"), buffer]);
    } else {
      buffer = Buffer.concat([Buffer.from("0488b21e", "hex"), buffer]);
    }

    const xpub = b58.encode(buffer);
    return xpub;
  }

  // Get address from XPUB
  getAddress(ticker: string, chainIndex, addressIndex: number): string {
    const coin = CoinFactory.getCoin(ticker);
    const zpub = this.getZpub(coin.ticker);
    const xpub = fromBase58(zpub, coin.network_data);

    const address = payments.p2wpkh({
      pubkey: xpub.derive(chainIndex).derive(addressIndex).publicKey,
      network: coin.network_data,
    }).address;

    return address;
  }

  // Get private key (WIF)
  getPrivateKey(ticker: string, chainIndex, addressIndex: number): string {
    // Get coin
    const coin = CoinFactory.getCoin(ticker);

    const mnemonic = this.getMnemonic();
    const seed = mnemonicToSeedSync(mnemonic);
    const root = fromSeed(seed, coin.network_data);

    const master = root.derivePath("m/84'/" + coin.bip_coin_type + "'/0'");
    const wif = master
      .derive(chainIndex)
      .derive(addressIndex)
      .toWIF();

    return wif;
  }

  // Create signed transaction
  // Expect the fee to to be in sats/byte, pulled from: https://bitcoinfees.earn.com/api/v1/fees/recommended
  // Handle everything in satoshis
  async createSignedTransaction(
    ticker,
    address: string,
    amount: number,
    fee: number
  ) {
    const coin = CoinFactory.getCoin(ticker);

    // Trim off any whitespace on the address
    address = address.trim();

    // Get mnemonic and derive the root key to create a BIP32 signer
    const mnemonic = this.getMnemonic();
    const seed = mnemonicToSeedSync(mnemonic);
    const root = fromSeed(seed, coin.network_data);

    // Fetch UTXOs (inputs) for our extended public key
    const blockbook = this.createBlockbookClient(ticker);
    const xpub = this.getZpub(ticker);

    // Prepare an array of inputs to be used in our transaction(s)
    const rawInputs = await blockbook.getUtxosForXpub(xpub);
    const inputs = [];

    let totalSatsInputAmount = 0;
    rawInputs.forEach((input) => {
      // Don't continue if we have enough inputs
      if (totalSatsInputAmount > amount) {
        return;
      }

      totalSatsInputAmount += parseInt(input.value);

      // Derive keypair from WIF
      const wif = root.derivePath(input.path).toWIF();
      const keyPair = ECPair.fromWIF(wif, coin.network_data);

      const p2wpkh = payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: coin.network_data,
      });

      // Prepare an input
      const preparedInput = {
        hash: input.txid,
        index: input.vout,
        witnessUtxo: {
          script: p2wpkh.output,
          value: parseInt(input.value),
        },
        bip32Derivation: [
          {
            masterFingerprint: root.fingerprint,
            path: input.path,
            pubkey: root.derivePath(input.path).publicKey,
          },
        ],
      };

      inputs.push(preparedInput);
    });

    // Create a test transaction to determine the TX fee we need
    const testTx = new Psbt({ network: coin.network_data });
    testTx.addInputs(inputs);

    testTx.addOutput({
      address: address,
      value: totalSatsInputAmount - amount,
    });

    // Sign and finalise the test transaction to extract its size
    testTx.signAllInputsHD(root);
    testTx.finalizeAllInputs();

    const finalTestTx = testTx.extractTransaction(true);
    const txSize = finalTestTx.virtualSize();

    // Now we have the test TX size, we can add an extra byte for each input just to be safe
    let txFee = fee * txSize;
    txFee += inputs.length;

    // We can begin to construct the proper transaction which will be broadcast to the network
    const tx = new Psbt({ network: coin.network_data });
    tx.addInputs(inputs);

    // Determine next unused change address and create the outputs
    const lastChangeIndex = await this.getLastIndex(coin.ticker, xpub, true);
    const changeAddress = this.getAddress(coin.ticker, 1, lastChangeIndex);

    // Recipient output
    tx.addOutput({
      address: address,
      value: amount,
    });

    // Change output
    const changeAmount = totalSatsInputAmount - amount - txFee;
    tx.addOutput({
      address: changeAddress,
      value: changeAmount,
    });

    // Sign and finalise the test transaction to extract its size
    tx.signAllInputsHD(root);
    tx.finalizeAllInputs();

    const finalTx = tx.extractTransaction();
    console.log(finalTx.toHex());
  }
}

export default new BTCP2WPKHWallet();
