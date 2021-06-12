import axios, { AxiosInstance } from "axios";
import { CoinFactory } from "../coins";
import { AbstractWallet } from "./abstract-wallet";
import { Blockbook } from "blockbook-client";

abstract class BTCWallet extends AbstractWallet {
  // Create an instance of Blockbook API
  createBlockbookClient(ticker: string): Blockbook {
    const coin = CoinFactory.getCoin(ticker);
    const blockbookUrl = coin.blockbook;

    if (blockbookUrl) {
      const blockbookClient = new Blockbook({
        nodes: [`https://cors-anywhere.herokuapp.com/${blockbookUrl}`],
      });

      return blockbookClient;
    }
  }

  // Lookup details for an XPUB/YPUB/ZPUB
  async getXpubInfo(xpub, ticker: string) {
    const blockbook = this.createBlockbookClient(ticker);

    try {
      await blockbook.getXpubDetails(xpub).then((data) => {
        console.log(data);
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}

export { BTCWallet };
