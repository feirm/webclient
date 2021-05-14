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
  name = "Feirm";
  ticker = "xfe";
  logo = require("@/assets/img/logo.webp");
  network = "binance";
  contract = "0x3de70dd9f65a860140f69f286a483f46e9be875a";
}

// Binance coin
class Binance implements Coin {
  name = "Binance";
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
  };

  // Full coins list
  static coinsList: Coin[] = [
    CoinFactory.coins.xfe,
    CoinFactory.coins.bnb,
    CoinFactory.coins.eth,
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
