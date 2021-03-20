import { gatewayApi } from "@/service/api/api";
import { EncryptedKey } from "@/models/account";

export default {
  // Send encrypted key payload
  SendKey(key: EncryptedKey) {
    return gatewayApi.post("auth/v1/add_key", key);
  },
  // Get encrypted account payload
  GetAccount() {
    return gatewayApi.get("auth/v1/get_account");
  }
};
