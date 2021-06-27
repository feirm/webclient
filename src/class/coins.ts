import { Network } from "bitcoinjs-lib";

// Representation of a coin
export interface Coin {
  name: string;
  ticker: string;
  balance?: string;
  logo: NodeRequire;
  network: string;
  contract?: string;

  // BTC-base fork settings
  blockbook?: string;
  segwit?: boolean;
  testnet?: boolean;
  bip_coin_type?: number;
  network_data?: Network;
}

// Feirm token
class Feirm implements Coin {
  name = "Feirm (BEP-20)";
  ticker = "xfe";
  logo = require("@/assets/img/logo.webp");
  network = "binance";
  contract = "0x3de70dd9f65a860140f69f286a483f46e9be875a";
}

// Binance coin
class Binance implements Coin {
  name = "Binance Smart Chain (BEP-20)";
  ticker = "bnb";
  logo = require("@/assets/img/binance.png");
  network = "binance";
}

// Polis token
class Polis implements Coin {
  name = "Polis (BEP-20)";
  ticker = "polis";
  logo = require("@/assets/img/polis.jpg");
  network = "binance";
  contract = "0xb5bea8a26d587cf665f2d78f077cca3c7f6341bd";
}

// Bitcoin
class Bitcoin implements Coin {
  name = "Bitcoin";
  ticker = "btc";
  logo = require("@/assets/img/bitcoin.png");
  network = "bitcoin";
  blockbook = "https://btc2.trezor.io";
  segwit = true;
  bip_coin_type = 0;
  network_data: Network = {
    messagePrefix: "\x18Bitcoin Signed Message:\n",
    bech32: "bc",
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0,
    scriptHash: 5,
    wif: 128,
  };
}

// Bitcoin Testnet
class TBitcoin implements Coin {
  name = "Bitcoin Testnet";
  ticker = "tbtc";
  logo = require("@/assets/img/bitcoin.png");
  network = "bitcoin";
  blockbook = "https://tbtc2.trezor.io";
  segwit = true;
  testnet = true;
  bip_coin_type = 1;
  network_data: Network = {
    messagePrefix: "\x18Bitcoin Signed Message:\n",
    bech32: "tb",
    bip32: {
      public: 0x045f1cf6,
      private: 0x045f18bc,
    },
    pubKeyHash: 111,
    scriptHash: 196,
    wif: 239,
  };
}

// Litecoin
class Litecoin implements Coin {
  name = "Litecoin";
  ticker = "ltc";
  logo = require("@/assets/img/litecoin.svg");
  network = "bitcoin";
  blockbook = "https://ltc1.trezor.io";
  segwit = true;
  testnet = false;
  bip_coin_type = 2;
  network_data: Network = {
    messagePrefix: "\x19Litecoin Signed Message:\n",
    bech32: "ltc",
    bip32: {
      public: 0x01b26ef6,
      private: 0x01b26792,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
  };
}

// Ethereum
class Ethereum implements Coin {
  name = "Ethereum";
  ticker = "eth";
  logo = require("@/assets/img/ethereum.png");
  network = "ethereum";
}

// DAI (Ethereum)
class DAI implements Coin {
  name = "DAI Stablecoin (ERC-20)";
  ticker = "dai";
  logo = require("@/assets/img/dai.png");
  network = "ethereum";
  contract = "0x6b175474e89094c44da98b954eedeac495271d0f";
}

// USDT (Ethereum)
class Tether implements Coin {
  name = "Tether (ERC-20)";
  ticker = "usdt";
  logo = require("@/assets/img/tether.png");
  network = "ethereum";
  contract = "0xdac17f958d2ee523a2206206994597c13d831ec7";
}

// BAT (Ethereum)
class BasicAttentionToken implements Coin {
  name = "Basic Attention Token (ERC-20)";
  ticker = "bat";
  logo = require("@/assets/img/basicattentiontoken.webp");
  network = "ethereum";
  contract = "0x0d8775f648430679a709e98d2b0cb6250d2887ef";
}

// BUSD (Ethereum)
class BinanceUSD implements Coin {
  name = "Binance USD (ERC-20)";
  ticker = "busd";
  logo = require("@/assets/img/binanceusd.png");
  network = "ethereum";
  contract = "0x4Fabb145d64652a948d72533023f6E7A623C7C53";
}

// Coin factory
export class CoinFactory {
  static coins: { [ticker: string]: Coin } = {
    xfe: new Feirm(),
    bat: new BasicAttentionToken(),
    btc: new Bitcoin(),
    tbtc: new TBitcoin(),
    bnb: new Binance(),
    busd: new BinanceUSD(),
    dai: new DAI(),
    eth: new Ethereum(),
    polis: new Polis(),
    usdt: new Tether(),
    ltc: new Litecoin(),
  };

  // Full coins list
  static coinsList: Coin[] = [
    CoinFactory.coins.xfe,
    CoinFactory.coins.bat,
    CoinFactory.coins.btc,
    CoinFactory.coins.tbtc,
    CoinFactory.coins.bnb,
    CoinFactory.coins.busd,
    CoinFactory.coins.dai,
    CoinFactory.coins.eth,
    CoinFactory.coins.polis,
    CoinFactory.coins.usdt,
    //CoinFactory.coins.ltc,
  ];

  // Fetch coin by its ticker
  static getCoin(ticker: string): Coin {
    ticker = ticker.toLowerCase();
    return this.coins[ticker];
  }

  // Get all coins
  static getCoins(): Coin[] {
    return this.coinsList;
  }
}
