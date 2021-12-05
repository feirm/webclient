import { gatewayApi } from "@/service/api/api";
import { EncryptedAccount, SignedSessionToken } from "@/models/account";

export default {
  // Check username availability
  CheckUsername(username: string) {
    return gatewayApi.post("/v1/auth/check-username", {
      username,
    });
  },

  // Check email availability
  CheckEmail(email: string) {
    return gatewayApi.post("/v1/auth/check-email", {
      email,
    });
  },

  // Create a login request
  CreateLoginRequest(username: string) {
    return gatewayApi.post("/v1/auth/login", {
      username,
    });
  },

  // Create TOTP login request
  CreateLoginRequestTOTP(username: string, token: string) {
    return gatewayApi.post("/v1/auth/login-totp", {
      username,
      token,
    });
  },

  // Get login request status
  LoginRequestStatus(tokenId: string) {
    return gatewayApi.post("/v1/auth/login/approve/status", {
      token_id: tokenId,
    });
  },

  // Approve a login request
  ApproveLogin(token: string) {
    return gatewayApi.post("/v1/auth/login/approve", {
      token,
    });
  },

  // Create a login session (access token)
  CreateLoginSession(username: string, tokenId: string, signature: string) {
    return gatewayApi.post("/v1/auth/login/create-session", {
      username: username,
      token_id: tokenId,
      signature: signature,
    });
  },

  // Send encrypted account payload
  CreateAccount(account: EncryptedAccount) {
    return gatewayApi.post("/v1/auth/register", account);
  },

  // Get ephemeral register token
  GetRegisterToken() {
    return gatewayApi.get("/v1/auth/register/new");
  },

  // Get encrypted account payload
  GetAccount() {
    return gatewayApi.get("/v1/auth/get-account");
  },

  // Get a new token to sign for refresh session
  GetRefreshSessionToken() {
    return gatewayApi.get("/v1/auth/refresh-session/new");
  },

  // Submit signed token to receive session token
  SubmitSignedSessionToken(token: SignedSessionToken) {
    return gatewayApi.post("/v1/auth/refresh-session", token);
  },

  // Verify email address
  VerifyEmail(token: string) {
    return gatewayApi.post("/v1/auth/account/verify-email", {
      token,
    });
  },

  // Resend email for account verification
  ResendEmailVerification() {
    return gatewayApi.post("/v1/auth/account/resend-verification-email");
  },

  // Enable TOTP
  EnableTOTP(secret: string, token: string) {
    return gatewayApi.post("/v1/auth/account/enable-totp", {
      secret,
      token,
    });
  },

  // Disable TOTP
  DisableTOTP() {
    return gatewayApi.post("/v1/auth/account/disable-totp");
  },

  // Get account recovery codes
  GetRecoveryCodes() {
    return gatewayApi.get("/v1/auth/account/recovery-codes");
  },

  // Delete account
  DeleteAccount() {
    return gatewayApi.post("/v1/auth/account/delete");
  },

  // Change password request token
  ChangePasswordToken() {
    return gatewayApi.get("/v1/auth/account/change-password");
  },

  // Change password
  ChangePassword(payload) {
    return gatewayApi.post("/v1/auth/account/change-password", payload);
  },
};
