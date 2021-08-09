import { EncryptedWallet } from "@/models/wallet";
import { gatewayApi } from "@/service/api/api";

export default {
  AddWallet(wallet: EncryptedWallet) {
    return gatewayApi.post("wallet/v1/add-wallet", wallet);
  },

  GetWallet() {
    return gatewayApi.get("wallet/v1/get-wallet");
  },

  RemoveWallet() {
    return gatewayApi.post("wallet/v1/remove-wallet");
  },

  GetStatus() {
    return gatewayApi.get("wallet/v1/status");
  },
};
