// Representation of an encrypted account
interface EncryptedAccount {
  email: string;
  username: string;
  identity_publickey: string;
  encrypted_key: EncryptedKey;
  created_at?: number;
  version?: number;

  token?: EphemeralToken;
}

// Representation of an encrypted key
interface EncryptedKey {
  key: string;
  signature: string;
  iv: string;
  salt: string;
}

// Representation of an ephemeral token signature payload
interface EphemeralToken {
  id?: string;
  nonce?: string;
  signature?: string;
}

// Representation of a signed session token
interface SignedSessionToken {
  token_id: string;
  signature: string;
}

export { EncryptedAccount, EncryptedKey, SignedSessionToken };
