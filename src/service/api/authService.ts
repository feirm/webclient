import { gatewayApi } from "@/service/api/api";
import { EncryptedAccount, SignedSessionToken } from "@/models/account";

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

  // Approve a login request
  ApproveLogin(token: string) {
    return gatewayApi.post("auth/v1/login/approve", {
      token
    });
  },

  // Create a login session (access token)
  CreateLoginSession(username: string, tokenId: string, signature: string) {
    return gatewayApi.post("auth/v1/login/create-session", {
      username: username,
      token_id: tokenId,
      signature: signature
    });
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

  // Get a new token to sign for refresh session
  GetRefreshSessionToken() {
    return gatewayApi.get("auth/v1/refresh-session/new");
  },

  // Submit signed token to receive session token
  SubmitSignedSessionToken(token: SignedSessionToken) {
    return gatewayApi.post("auth/v1/refresh-session", token);
  },

  // Verify email address
  VerifyEmail(token: string) {
    return gatewayApi.post("auth/v1/account/verify-email", {
      token
    });
  }
};
