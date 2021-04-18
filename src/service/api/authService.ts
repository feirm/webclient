import { gatewayApi } from "@/service/api/api";
import { EncryptedAccount } from "@/models/account";

export default {
  // Check username availability
  CheckUsername(username: string) {
    return gatewayApi.post("auth/v1/check-username", {
      username
    });
  },

  // Check email availability
  CheckEmail(email: string) {
    return gatewayApi.post("auth/v1/check-email", {
      email,
    });
  },

  // Create a login request
  CreateLoginRequest(username: string) {
    return gatewayApi.post("auth/v1/login", {
      username
    });
  },

  // Get login request status
  LoginRequestStatus(tokenId: string) {
    return gatewayApi.post("auth/v1/login/approve/status", {
      token_id: tokenId
    });
  },

  // Login to an account
  Login(username: string, totp: string) {
    return gatewayApi.post("auth/v1/login", {
      username,
      totp
    })
  },

  // Send encrypted account payload
  CreateAccount(account: EncryptedAccount) {
    return gatewayApi.post("auth/v1/register", account);
  },
  
  // Get ephemeral register token
  GetRegisterToken() {
    return gatewayApi.get("auth/v1/register/new");
  },

  // Get encrypted account payload
  GetAccount() {
    return gatewayApi.get("auth/v1/get-account");
  },

  // Get new authentication token pair
  RefreshTokens(refreshToken: string) {
    return gatewayApi.post("auth/v1/refresh-tokens", {
      refresh_token: refreshToken
    })
  },

  // Verify email address
  VerifyEmail(token: string) {
    return gatewayApi.post("auth/v1/account/verify-email", {
      token
    });
  }
};
