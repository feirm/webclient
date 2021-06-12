import axios, { AxiosInstance } from "axios";
import { CoinFactory } from "../coins";
import { AbstractWallet } from "./abstract-wallet";

abstract class BTCWallet extends AbstractWallet {
  // Create an Axios instance for Blockbook API
  createBlockbookClient(ticker: string): AxiosInstance {
    const coin = CoinFactory.getCoin(ticker);
    const blockbookUrl = coin.blockbook;

    if (blockbookUrl) {
      const blockbookClient = axios.create({
        baseURL: `${blockbookUrl}/api/v2/`,
      });

      return blockbookClient;
    }
  }

  // Lookup details for an XPUB/YPUB/ZPUB
  async getXpubInfo(xpub, ticker: string) {
    const blockbook = this.createBlockbookClient(ticker);

    try {
      await blockbook.post(`xpub/${xpub}`).then((res) => {
        console.log(res.data);
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}

export { BTCWallet };
