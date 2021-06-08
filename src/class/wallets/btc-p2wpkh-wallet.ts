import { fromBase58, fromSeed } from "bip32";
import { mnemonicToSeedSync } from "bip39";
import { payments } from "bitcoinjs-lib";
import { CoinFactory } from "../coins";
import { AbstractWallet } from "./abstract-wallet";
import b58 from "bs58check";

class BTCP2WPKHWallet extends AbstractWallet {
  getZpub(ticker: string) {
    // Find coin
    const coin = CoinFactory.getCoin(ticker);

    const mnemonic = this.getMnemonic();
    if (!mnemonic) {
      throw new Error("Mnemonic not loaded!");
    }

    const seed = mnemonicToSeedSync(mnemonic);
    const root = fromSeed(seed, coin.network_data); // Always going to be 1st network

    // Only supporting Bitcoin BIP-84 (native segwit)
    const master = root.derivePath("m/84'/" + 0 + "'/0'");
    const zpub = master.neutered().toBase58();

    // Derive Segwit address
    /*
    const address = payments.p2wpkh({
      pubkey: master.derive(0).derive(0).publicKey,
    }).address;

    console.log(xpub);
    console.log(address);
    */

    return zpub;
  }

  // BitcoinJS doesn't like ZPUBs, so convert one into an XPUB
  getXpub(zpub: string): string {
    if (!zpub) {
      throw new Error("Need to provide ZPUB!");
    }

    let buffer = b58.decode(zpub);
    buffer = buffer.slice(4);
    buffer = Buffer.concat([Buffer.from("0488b21e", "hex"), buffer]);

    const xpub = b58.encode(buffer);
    return xpub;
  }
}

export default new BTCP2WPKHWallet();
