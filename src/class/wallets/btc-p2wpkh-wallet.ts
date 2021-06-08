import { fromBase58, fromSeed } from "bip32";
import { mnemonicToSeedSync } from "bip39";
import { address, payments } from "bitcoinjs-lib";
import { CoinFactory } from "../coins";
import { AbstractWallet } from "./abstract-wallet";
import b58 from "bs58check";

class BTCP2WPKHWallet extends AbstractWallet {
  private xpub: string;
  private zpub: string;

  setXpub(xpub: string) {
    this.xpub = xpub;
  }

  setZpub(zpub: string) {
    this.zpub = zpub;
  }

  getZpub(ticker: string) {
    // Cache hit
    if (this.zpub) {
      return this.zpub;
    }

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

  // BitcoinJS doesn't like ZPUBs, so convert one into an XPUB
  getXpub(zpub: string): string {
    // Cache hit
    if (this.xpub) {
      return this.xpub;
    }

    if (!zpub) {
      throw new Error("Need to provide ZPUB!");
    }

    let buffer = b58.decode(zpub);
    buffer = buffer.slice(4);
    buffer = Buffer.concat([Buffer.from("0488b21e", "hex"), buffer]);

    const xpub = b58.encode(buffer);
    return xpub;
  }

  // Get address from XPUB
  getAddress(chainIndex, addressIndex: number): string {
    const xpub = fromBase58(this.xpub);

    const address = payments.p2wpkh({
      pubkey: xpub.derive(chainIndex).derive(addressIndex).publicKey,
    }).address;

    return address;
  }

  // TODO: Get private key
}

export default new BTCP2WPKHWallet();
