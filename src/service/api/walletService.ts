import { EncryptedWallet } from "@/models/wallet";
import { gatewayApi } from "@/service/api/api";

export default {
  AddWallet(wallet: EncryptedWallet) {
    return gatewayApi.post("wallet/add-wallet", wallet);
  },

  GetWallet() {
    return gatewayApi.get("wallet/get-wallet");
  },

  RemoveWallet() {
    return gatewayApi.post("wallet/remove-wallet");
  },
};
