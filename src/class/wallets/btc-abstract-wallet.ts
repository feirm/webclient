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
        nodes: [`https://cors-anywhere.feirm.com/${blockbookUrl}`],
      });

      return blockbookClient;
    }
  }

  // Lookup details for an XPUB/YPUB/ZPUB
  async getXpubInfo(xpub, ticker: string) {
    const blockbook = this.createBlockbookClient(ticker);

    try {
      return await blockbook.getXpubDetails(xpub);
    } catch (e) {
      throw new Error(e);
    }
  }

  // Fetch the latest address index for an extended public key
  async getLastIndex(ticker, xpub: string, change: boolean) {
    const blockbook = this.createBlockbookClient(ticker);
    let lastIndex = 0;

    const data = await blockbook.getXpubDetails(xpub, { tokens: "used" });
    data.tokens.forEach((token) => {
      const path = token.path;

      // Split up the path to extract account index
      const split = path.split("/");
      const node = parseInt(split[4]);
      const index = parseInt(split[5]);

      // Handle standard address
      if (!change && node === 0) {
        lastIndex = index + 1;
      }

      // We have a change address so increment the lowest change amount
      if (change && node === 1) {
        lastIndex = index + 1;
      }
    });

    return lastIndex;
  }
}

export { BTCWallet };
