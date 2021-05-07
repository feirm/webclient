import bufferToHex from "@/helpers/bufferToHex";
import hexToBytes from "@/helpers/hexToBytes";

import { EncryptedAccount, EncryptedKey } from "@/models/account";
import { ArgonType, hash } from "argon2-browser";

import SessionKeystore from 'session-keystore'

import keccak256 from "keccak256";

import { eddsa } from "elliptic";
import { sign, SignKeyPair } from "tweetnacl";
const ec = new eddsa('ed25519');

// Key types
enum Keys {
  ENCRYPTION = "enc",
  IDENTITY = "identity"
}

class Account {
  private rootKey: Uint8Array;
  public store: SessionKeystore;

  constructor() {
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
    // Verify the signature of the encrypted root key to check it hasn't been tampered
    const key = ec.keyFromPublic(payload.identity_publickey)

    // Hash the root key ciphertext using Keccak256
    const msg = keccak256(payload.encrypted_key.key);

    // Error if signature is not valid
    const valid = key.verify(msg, payload.encrypted_key.signature);
    if (!valid) {
      return Promise.reject("Signature is invalid, encrypted payload might be tampered.")
    }

    // Extract the salt used for password hashing
    // and the IV used for AES encryption
    const salt = hexToBytes(payload.encrypted_key.salt).slice(0, 16);
    const iv = hexToBytes(payload.encrypted_key.iv).slice(0, 16);

    // Convert the encrypted key into byte form
    const keyBytes = Buffer.from(payload.encrypted_key.key, 'hex');

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

    // Derive Keccak256 hash of message
    const hash = keccak256(Buffer.from(msg));

    // Sign and return hex signature
    const signed = identityKeypair.sign(hash).toHex().toLowerCase();
    return signed;
  }

  // Derive encryption key
  async deriveEncryptionKey(rootKey: Uint8Array): Promise<CryptoKey> {
    // Construct master encryption key by SHA-256 hashing root key + enc
    const keyType = new TextEncoder().encode(Keys.ENCRYPTION);
    const mergedKey = new Uint8Array([...rootKey, ...keyType])
    const encKey = await window.crypto.subtle.digest("SHA-256", mergedKey);

    // Derive AES256 encryption key
    const aesKey = await window.crypto.subtle.importKey(
      "raw",
      encKey,
      { name: "AES-CBC" },
      false,
      ["encrypt", "decrypt"]
    );

    // Return the AES key
    return aesKey;
  }

  // Derive a legacy identity keypair using TweetNaCl.js
  public async deriveIdentityKeypairLegacy(rootKey: Uint8Array): Promise<SignKeyPair> {
    // It isn't sensible to use the same key for multiple use cases, so we
    // should derive a signing "key" which is used as the seed to produce
    // a full ed25519 signing keypair.
    const identityKeyString = bufferToHex(rootKey) + Keys.IDENTITY;
    const identityKey = await window.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(identityKeyString)
    );

    // Derive signing keypair from seed
    const identityKeypair = sign.keyPair.fromSeed(new Uint8Array(identityKey));
    return identityKeypair;
  }
}

export default new Account();
