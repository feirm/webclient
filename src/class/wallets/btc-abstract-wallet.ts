import axios, { AxiosInstance } from "axios";
import { CoinFactory } from "../coins";
import { AbstractWallet } from "./abstract-wallet";

abstract class BTCWallet extends AbstractWallet {
  createBlockbookClient(ticker: string): AxiosInstance {
    const coin = CoinFactory.getCoin(ticker);
    const blockbookUrl = coin.blockbook;

    if (blockbookUrl) {
      const blockbookClient = axios.create({
        baseURL: blockbookUrl,
      });

      return blockbookClient;
    }
  }
}

export { BTCWallet };
