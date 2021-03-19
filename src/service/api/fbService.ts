import { firebaseApi } from "./api";

// Firebase authentication service
export default {
  getNewIdToken(refreshToken: string) {
    return firebaseApi.post("", {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    });
  }
};
