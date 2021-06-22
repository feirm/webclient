import { fromBase58, fromSeed } from "bip32";
import { mnemonicToSeedSync } from "bip39";
import { ECPair, payments, Psbt } from "bitcoinjs-lib";
import { CoinFactory } from "../coins";
import b58 from "bs58check";
import { BTCWallet } from "./btc-abstract-wallet";
import sb from "satoshi-bitcoin";

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

  // Create signed transaction
  // Expect the fee to to be in sats/byte, pulled from: https://bitcoinfees.earn.com/api/v1/fees/recommended
  // Handle everything in satoshis
  async createSignedTransaction(ticker, address, amount: number, fee: number) {
    const coin = CoinFactory.getCoin(ticker);

    // Get mnemonic and derive the root key to create a BIP32 signer
    const mnemonic = this.getMnemonic();
    const seed = mnemonicToSeedSync(mnemonic);
    const root = fromSeed(seed, coin.network_data);

    // Roughly estimate the TX size (1 input, 2 outputs = 250B)
    const feeEstimate = fee * 250;

    // Fetch UTXOs for the extended public key
    const blockbook = this.createBlockbookClient(ticker);
    const xpub = this.getZpub(ticker);
    const utxos = await blockbook.getUtxosForXpub(xpub);

    const psbt = new Psbt({ network: coin.network_data });

    let totalSatsUtxoAmount: number;
    for (let i = 0; i < utxos.length; i++) {
      const utxo = utxos[i];

      // Check if we have satisfied the amount we want to send
      if (totalSatsUtxoAmount > amount) {
        console.log("UTXO balance:", totalSatsUtxoAmount);
        return;
      }

      // Derive the keypair needed for the transaction
      const keyPair = ECPair.fromWIF(
        root.derivePath(utxo.path).toWIF(),
        coin.network_data
      );
      const publicKey = keyPair.publicKey;
      const p2wpkh = payments.p2wpkh({
        pubkey: publicKey,
        network: coin.network_data,
      });

      const sats = parseFloat(utxos[i].value);
      totalSatsUtxoAmount = totalSatsUtxoAmount + sats;

      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: p2wpkh.output,
          value: parseInt(utxo.value),
        },
        /*
        bip32Derivation: [
          {
            masterFingerprint: root.fingerprint,
            path: utxo.path,
            pubkey: root.derivePath(utxo.path).publicKey,
          },
        ],
        */
      });
    }

    // Create outputs - one for the recipient and then another as a change address
    psbt.addOutput({
      address: address,
      value: amount,
    });

    // Iterate over all the inputs and sign them
    psbt.txInputs.forEach(input);

    // Sign, validate and finalise all inputs
    psbt.signAllInputsHD(root);
    psbt.validateSignaturesOfAllInputs();
    psbt.finalizeAllInputs();

    console.log(psbt);
    console.log(psbt.toHex());
  }
}

export default new BTCP2WPKHWallet();
