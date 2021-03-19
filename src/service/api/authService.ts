import { authApi } from "@/service/api/api";
import { EncryptedKey } from "@/models/account";

export default {
  // Send encrypted key payload
  SendKey(key: EncryptedKey) {
    return authApi.post("v1/add_key", key);
  }
};
