import bufferToHex from "@/helpers/bufferToHex";
import hexToBytes from "@/helpers/hexToBytes";

import { EncryptedAccount, EncryptedKey } from "@/models/account";
import { ArgonType, hash } from "argon2-browser";
import { DB } from "@/class/db";

class Account extends DB {
  private rootKey: Uint8Array;

  // Set account root key
  setRootKey(rootKey: Uint8Array) {
    this.rootKey = rootKey;
  }

  // Get account root key
  getRootKey(): Uint8Array {
    return this.rootKey;
  }

  // Generate an encrypted root key
  async generateEncryptedRootKey(password: string): Promise<EncryptedKey> {
    // Generate some salt to be used when stretching the encryption key, and an IV for the encryption itself
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    // Generate a root key for the account
    const rootKey = window.crypto.getRandomValues(new Uint8Array(32));

    // Derive stretched key from encryption key
    const stretchedKey = await hash({
      pass: password,
      salt: salt,
      type: ArgonType.Argon2id,
      hashLen: 32
    });

    // Derive an encryption key to encrypt the root key with
    const encryptionKey = await window.crypto.subtle.importKey(
      "raw",
      stretchedKey.hash,
      { name: "AES-CBC" },
      false,
      ["encrypt", "decrypt"]
    );

    // Encrypt the root key with the newly created encryption key
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-CBC", iv: iv },
      encryptionKey,
      rootKey
    );

    const key = {
      key: bufferToHex(ciphertext),
      iv: bufferToHex(iv),
      salt: bufferToHex(salt)
    } as EncryptedKey;

    return key;
  }

  // Decrypt an encrypted root key payload
  async decryptRootKey(
    password: string,
    payload: EncryptedAccount
  ): Promise<Uint8Array> {
    // Extract the salt used for password hashing
    // and the IV used for AES encryption
    const salt = hexToBytes(payload.encrypted_key.salt).slice(0, 16);
    const iv = hexToBytes(payload.encrypted_key.iv).slice(0, 16);

    // Convert the encrypted key into byte form
    const keyBytes = hexToBytes(payload.encrypted_key.key);

    // Derive stretched key from password
    const stretchedKey = await hash({
      pass: password,
      salt: salt,
      type: ArgonType.Argon2id,
      hashLen: 32
    });

    // Derive the key we encrypted the root key with
    const encryptionKey = await window.crypto.subtle.importKey(
      "raw",
      stretchedKey.hash,
      { name: "AES-CBC" },
      false,
      ["encrypt", "decrypt"]
    );

    // Decrypt the ciphertext to get our root key
    const rootKey = await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv: iv },
      encryptionKey,
      keyBytes
    );
    return new Uint8Array(rootKey);
  }

  /*
    IndexedDB account methods
  */

  // Save an encrypted blob
  async saveAccount(account: EncryptedAccount) {
    // Clear any existing accounts
    await this.account.clear();

    await this.account.add(account, account.uid);
  }

  // Fetch the encrypted blob
  async fetchAccount(): Promise<EncryptedAccount> {
    // Handle empty accounts first
    const accounts = await this.account.toArray();
    if (accounts.length === 0) {
      return {} as EncryptedAccount;
    }

    // If we get this far, it should be expected to have an account
    const account = await this.account.orderBy("uid").last();
    return account!;
  }
}

export default new Account();
