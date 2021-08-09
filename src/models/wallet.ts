// Representation of an encrypted wallet payload
interface EncryptedWallet {
  id: string;
  uid?: string;

  coins: Coins[]; // V2 wallet attribute

  ciphertext: string;
  iv: string;
  signature: string;
  version: number;
}

interface Coins {
  ticker: string;
  address: string;
}

export { EncryptedWallet, Coins };
