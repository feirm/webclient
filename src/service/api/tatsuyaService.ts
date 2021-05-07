import { tatsuyaApi } from "@/service/api/api";

export default {
  fetchEncryptedAccount(user: string, pin: string) {
    return tatsuyaApi.post(`/v1/login/fetchAccount`, {
      username: user,
      pin: pin
    });
  }
};
