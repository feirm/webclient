import { gatewayApi } from "@/service/api/api";
import { EncryptedAccount } from "@/models/account";

export default {
  // Check username availability
  CheckUsername(username: string) {
    return gatewayApi.post("auth/v1/checkusername", {
      username
    });
  },

  // Send encrypted account payload
  SendKey(account: EncryptedAccount) {
    return gatewayApi.post("auth/v1/register", account);
  },

  // Get encrypted account payload
  GetAccount() {
    return gatewayApi.get("auth/v1/get_account");
  }
};
