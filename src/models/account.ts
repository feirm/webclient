// Representation of an encrypted account
interface EncryptedAccount {
  username: string;
  encrypted_key: EncryptedKey;
  created_at?: number;
  version?: number;

  totp_secret?: string;
  totp_code?: number;
}

// Representation of an encrypted key
interface EncryptedKey {
  key: string;
  iv: string;
  salt: string;
}

export { EncryptedAccount, EncryptedKey };
