import { AbstractWallet } from "./abstract-wallet";

/**
 * A BIP-44 compatible wallet suitable for Ethereum and Binance Smart Chain
 * Derived from a BIP39 mnemonic
 */
class ETHWallet extends AbstractWallet {}

// Export a single instance of the ETH Wallet
export default new ETHWallet();