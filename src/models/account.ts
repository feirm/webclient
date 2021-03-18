// Representation of an encrypted account
interface EncryptedAccount {
    uid: string;
    encrypted_key: EncryptedKey;
    created_at: number;
    version: number;
}

// Representation of an encrypted key
interface EncryptedKey {
    key: string;
    iv: string;
    salt: string;
}

export {
    EncryptedAccount,
    EncryptedKey
}