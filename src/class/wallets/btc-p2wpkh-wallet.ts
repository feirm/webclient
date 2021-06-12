import { fromBase58, fromSeed } from "bip32";
import { mnemonicToSeedSync } from "bip39";
import { payments } from "bitcoinjs-lib";
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
    const master = root.derivePath("m/84'/" + 0 + "'/0'");
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
    const xpub = fromBase58(this.xpub);

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

    const master = root.derivePath("m/84'/" + 0 + "'/0'");
    const wif = master
      .derive(chainIndex)
      .derive(addressIndex)
      .toWIF();

    return wif;
  }
}

export default new BTCP2WPKHWallet();
