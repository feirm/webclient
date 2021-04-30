interface Wallet {};

// Representation of an encrypted wallet payload
interface EncryptedWallet {
    id: string;
    uid?: string;
    ciphertext: string;
    iv: string;
    signature: string;
}