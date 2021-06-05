// Representation of an encrypted wallet payload
interface EncryptedWallet {
  id: string;
  address: string;
  uid?: string;
  ciphertext: string;
  iv: string;
  signature: string;
  version: number;
}

export { EncryptedWallet };
