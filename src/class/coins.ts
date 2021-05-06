// Representation of a coin
export interface Coin {
    name: string;
    ticker: string;
    logo: any;
    network: string;
    contract?: string;
}

// Feirm token
class Feirm implements Coin {
    name = "Feirm";
    ticker = "xfe";
    logo = require("@/assets/img/logo.webp");
    network = "binance";
    contract = "0x6ebfe4b1674b0c7d45f3a2b898904b268b6f3b06"; // TESTNET
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
        eth: new Ethereum()
    }

    // Full coins list
    static coinsList: Coin[] = [
        CoinFactory.coins.xfe,
        CoinFactory.coins.bnb,
        CoinFactory.coins.eth
    ]

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