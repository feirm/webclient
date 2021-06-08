import bufferToHex from "@/helpers/bufferToHex";
import { EncryptedWallet, EncryptedWalletV2, Coins } from "@/models/wallet";
import { entropyToMnemonic, validateMnemonic } from "bip39";
import { v4 as uuidv4 } from "uuid";

import account from "../account";
import { CoinFactory } from "../coins";
import ethWallet from "./eth-wallet";

export abstract class AbstractWallet {
  private id: string; // Random UUID
  private mnemonic: string; // BIP39 mnemonic

  // Get wallet ID
  public getId() {
    // Cache hit
    if (this.id) {
      return this.id;
    }

    const uuid = uuidv4();
    this.id = uuid;

    return uuid;
  }

  // Set a wallet ID
  public setId(id: string) {
    this.id = id;
  }

  // Set a mnemonic
  public setMnemonic(mnemonic: string) {
    // Validate the mnemonic
    const valid = validateMnemonic(mnemonic);
    if (!valid) {
      throw new Error("The mnemonic is invalid!");
    }

    this.mnemonic = mnemonic;
  }

  // Generate a 24-word mnemonic
  public generateMnemonic(): string {
    const entropy = window.crypto.getRandomValues(new Uint8Array(32));
    const entropyBytes = Buffer.from(entropy);

    const mnemonic = entropyToMnemonic(entropyBytes);
    return mnemonic;
  }

  // Return the 24-word mnemonic if we have it
  public getMnemonic(): string {
    if (!this.mnemonic) {
      throw new Error("Mnemonic not loaded!");
    }

    return this.mnemonic;
  }

  // Encrypt wallet using account encryption key
  public async encrypt(rootKey: Uint8Array): Promise<EncryptedWallet> {
    // Derive encryption key from root key and also an IV
    const encryptionKey = await account.deriveEncryptionKey(rootKey);
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    // Convert the mnemonic to bytes
    const mnemonicBytes = new TextEncoder().encode(this.getMnemonic());

    // Construct encrypted wallet payload
    const wallet = {
      id: this.getId(),
      iv: bufferToHex(iv),
    } as EncryptedWallet;

    // Encrypt the mnemonic with AES-256-CBC
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-CBC", iv: iv },
      encryptionKey,
      mnemonicBytes
    );

    // Sign the ciphertext with our identity key
    const keypair = await account.deriveIdentityKeypair(rootKey);
    const signature = await account.signMessage(
      keypair,
      bufferToHex(ciphertext)
    );

    wallet.ciphertext = bufferToHex(ciphertext);
    wallet.signature = signature;

    return wallet;
  }

  // Decrypt wallet to return mnemonic
  public async decryptWallet(
    rootKey: Uint8Array,
    wallet: EncryptedWallet
  ): Promise<string> {
    // Reconstruct encryption key and convert some properties to buffer form
    const encryptionKey = await account.deriveEncryptionKey(rootKey);
    const iv = Buffer.from(wallet.iv, "hex");

    const mnemonicBytes = Buffer.from(wallet.ciphertext, "hex");

    // Decrypt the wallet
    const decryptWallet = await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv: iv },
      encryptionKey,
      mnemonicBytes
    );

    // Convert from buffer to utf-8 readable
    const mnemonic = new TextDecoder().decode(decryptWallet);
    return mnemonic;
  }

  // Methods to handle wallet version updates
  public async updateWallet(
    rootKey: Uint8Array,
    wallet: EncryptedWallet | EncryptedWalletV2
  ): Promise<any> {
    // Depending on the version, there needs to be an upgrade made
    switch (wallet.version) {
      case 1: {
        // If the wallet is version 1, we need to upgrade it to v2 which contains a token property
        console.log("[Wallet] Has a V1 wallet, need to upgrade it...");
        //const mnemonic = await this.decryptWallet(rootKey, wallet);

        // We are only supporting the XFE token in this version
        const address = ethWallet.getWallet().getAddressString();
        const token = CoinFactory.getCoin("xfe");

        const coin: Coins = {
          address: address,
          ticker: token.ticker,
        };

        const walletV2: EncryptedWalletV2 = {
          id: wallet.id,
          coins: [coin],
          ciphertext: wallet.ciphertext,
          iv: wallet.iv,
          signature: wallet.signature,
          version: 2,
        };

        //console.log(walletV2);
        // TODO: Send V2 wallet to API

        break;
      }
      default: {
        console.log("[Wallet] Version not supported in this client...");
        break;
      }
    }
  }
}
