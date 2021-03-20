import { EncryptedAccount } from "@/models/account";
import { Dexie, Table } from "dexie";

class DB extends Dexie {
    // Tables
    account: Table<EncryptedAccount>;

    constructor() {
        super("feirm");

        // Create stores
        this.version(1).stores({
            account: "uid"
        });

        // Assign tables
        this.account = this.table("account");
    }
}

export { DB };