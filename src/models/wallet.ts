// Representation of an encrypted wallet payload
interface EncryptedWallet {
  id: string;
  uid?: string;
  ciphertext: string;
  iv: string;
  signature: string;
  version: number;
}

// V2
interface EncryptedWallet {
  id: string;
  uid?: string;
  coins: Coins[];
  ciphertext: string;
  iv: string;
  signature: string;
  version: number;
}

interface Coins {
  ticker: string;
  address: string;
}

export { EncryptedWallet };
