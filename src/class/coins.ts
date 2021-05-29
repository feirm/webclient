// Representation of a coin
export interface Coin {
  name: string;
  ticker: string;
  balance?: string;
  logo: NodeRequire;
  network: string;
  contract?: string;
}

// Feirm token
class Feirm implements Coin {
  name = "Feirm (BEP-20)";
  ticker = "xfe";
  logo = require("@/assets/img/logo.webp");
  network = "binance";
  contract = "0x3de70dd9f65a860140f69f286a483f46e9be875a";
}

// USDT (Ethereum)
class Tether implements Coin {
  name = "Tether (ERC-20)";
  ticker = "usdt";
  logo = require("@/assets/img/tether.png");
  network = "ethereum";
  contract = "0xdac17f958d2ee523a2206206994597c13d831ec7";
}

// Binance coin
class Binance implements Coin {
  name = "Binance Smart Chain (BEP-20)";
  ticker = "bnb";
  logo = require("@/assets/img/binance.png");
  network = "binance";
}

// Ethereum
class Ethereum implements Coin {
  name = "Ethereum";
  ticker = "eth";
  logo = require("@/assets/img/ethereum.png");
  network = "ethereum";
}

// Coin factory
export class CoinFactory {
  static coins: { [ticker: string]: Coin } = {
    xfe: new Feirm(),
    bnb: new Binance(),
    eth: new Ethereum(),
    usdt: new Tether(),
  };

  // Full coins list
  static coinsList: Coin[] = [
    CoinFactory.coins.xfe,
    CoinFactory.coins.bnb,
    CoinFactory.coins.eth,
    CoinFactory.coins.usdt,
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
