import { EncryptedWallet } from "@/models/wallet";
import Dexie from "dexie";

export class DB extends Dexie {
  // Tables
  wallets: Dexie.Table<EncryptedWallet>;

  constructor() {
    super("feirm");

    this.version(1).stores({
      wallets: "id"
    });

    this.wallets = this.table("wallets");
  }
}
