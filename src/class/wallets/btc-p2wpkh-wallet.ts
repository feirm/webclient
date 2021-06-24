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
    if (!this.xpub) {
      throw new Error("No XPUB present!");
    }

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

    // Roughly estimate the TX size (1 input, 2 outputs = 250B)
    const feeEstimate = fee * 250;

    // Fetch UTXOs (inputs) for our extended public key
    const blockbook = this.createBlockbookClient(ticker);
    const xpub = this.getZpub(ticker);

    const inputs = await blockbook.getUtxosForXpub(xpub);
    let totalSatsInputAmount = 0;

    const psbt = new Psbt({ network: coin.network_data });

    inputs.forEach((input) => {
      // Don't continue if we have enough inputs
      if (totalSatsInputAmount > amount) {
        return;
      }

      totalSatsInputAmount += amount;

      // Derive keypair from WIF
      const wif = root.derivePath(input.path).toWIF();
      const keyPair = ECPair.fromWIF(wif, coin.network_data);

      const p2wpkh = payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: coin.network_data,
      });

      psbt.addInput({
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
      });
    });

    // Create outputs - one for the recipient and then another as a change address
    psbt.addOutput({
      address: address,
      value: amount,
    });

    // TODO: Properly determine change amount
    psbt.addOutput({
      address: this.getAddress(coin.ticker, 1, 0),
      value: totalSatsInputAmount - amount - feeEstimate,
    });

    // Sign, validate and finalise all inputs
    psbt.signAllInputsHD(root);

    if (!psbt.validateSignaturesOfAllInputs()) {
      throw new Error("Signature validation failed!");
    }

    psbt.finalizeAllInputs();

    const txHash = psbt.extractTransaction().toHex();
    console.log(txHash);
  }
}

export default new BTCP2WPKHWallet();
