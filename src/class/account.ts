import bufferToHex from "@/helpers/bufferToHex";
import hexToBytes from "@/helpers/hexToBytes";

import { EncryptedAccount, EncryptedKey } from "@/models/account";
import { ArgonType, hash } from "argon2-browser";
import { DB } from "@/class/db";

import SessionKeystore from 'session-keystore'

import { eddsa } from "elliptic";
const ec = new eddsa('ed25519');

// Key types
enum Keys {
  ENCRYPTION = "enc",
  IDENTITY = "identity"
}

class Account extends DB {
  private rootKey: Uint8Array;
  public store: SessionKeystore;

  constructor() {
    super();

    this.store = new SessionKeystore<"feirm">();
  }

  // Set account root key
  setRootKey(rootKey: Uint8Array) {
    this.rootKey = rootKey;

    // Store root key
    this.store.set("rootKey", bufferToHex(rootKey))
  }

  // Get account root key
  getRootKey(): Uint8Array {
    // Cache hit
    if (this.rootKey) {
      return this.rootKey;
    }

    // Fetch from session store
    const rootKey = this.store.get("rootKey");
    return hexToBytes(rootKey);
  }

  // Generate a plaintext root key
  generateRootKey(): Uint8Array {
    return window.crypto.getRandomValues(new Uint8Array(32));
  }

  // Generate an encrypted root key
  async generateEncryptedRootKey(rootKey: Uint8Array, password: string): Promise<EncryptedKey> {
    // Generate some salt to be used when stretching the encryption key, and an IV for the encryption itself
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

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

    // Derive identity keypair
    const keypair = await this.deriveIdentityKeypair(rootKey);

    // Sign the encrypted payload with the identity key
    const signature = await this.signMessage(keypair, bufferToHex(ciphertext));

    const key = {
      key: bufferToHex(ciphertext),
      signature: signature,
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
    Root key methods
  */
  // Derive identity (Ed25519) keypair
  async deriveIdentityKeypair(rootKey: Uint8Array): Promise<eddsa.KeyPair> {
    // Construct the master signing key by SHA-256 hashing the root key + identity
    const keyType = new TextEncoder().encode(Keys.IDENTITY);
    const mergedKey = new Uint8Array([...rootKey, ...keyType]);
    const signKey = await window.crypto.subtle.digest("SHA-256", mergedKey);

    // Derive the keypair from our signKey
    const keypair = ec.keyFromSecret(Buffer.from(signKey));
    return keypair;
  }

  // Sign a message using Ed25519
  async signMessage(identityKeypair: eddsa.KeyPair, message: string): Promise<string> {
    // Convert the message to bytes
    const msg = new TextEncoder().encode(message);

    // Sign and return hex signature
    const signed = identityKeypair.sign(Buffer.from(msg)).toHex().toLowerCase();
    return signed;
  }

  /*
    IndexedDB account methods
  */

  // Save an encrypted blob
  async saveAccount(account: EncryptedAccount) {
    // Clear any existing accounts
    await this.account.clear();
    await this.account.add(account, account.username); // TODO: Properly fix this
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
