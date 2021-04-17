// Representation of an encrypted account
interface EncryptedAccount {
  email: string;
  username: string;
  identity_pubkey: string;
  encrypted_key: EncryptedKey;
  created_at?: number;
  version?: number;
}

// Representation of an encrypted key
interface EncryptedKey {
  key: string;
  signature: string;
  iv: string;
  salt: string;
}

export { EncryptedAccount, EncryptedKey };
