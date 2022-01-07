import account from "@/class/account";
import { SignedSessionToken } from "@/models/account";
import { store } from "@/store";
import axios from "axios";
import authService from "./authService";

// This file contains all the Axios instances for interacting with various APIs
// Create an instance for the Feirm Gateway
const gatewayApi = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach Authorization header to requests
gatewayApi.interceptors.request.use(
  config => {
    const accessToken = store.getters.getAccessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Handle unauthorized responses by using the refresh token
gatewayApi.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Handle the unauthorized request if it isn't a retry
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Get the root key
      const rootKey = account.getRootKey();
      if (!rootKey) {
        return Promise.reject("No root key present!");
      }

      // Derive identity keypair
      const keypair = await account.deriveIdentityKeypair(rootKey);

      // Request for new token to be signed from auth API
      const token = await authService.GetRefreshSessionToken();

      const tokenId = token.data.id;
      const nonce = token.data.nonce;

      // Sign the nonce with the identity keypair
      const signed = await account.signMessage(keypair, nonce);

      const signedToken: SignedSessionToken = {
        token_id: tokenId,
        signature: signed
      };

      // Submit to API
      const res = await authService.SubmitSignedSessionToken(signedToken);
      const accessToken = res.data.access_token;

      // Update the access token in Vuex
      store.dispatch("login", accessToken);

      // Update the Authorization header on the original request
      originalRequest.headers.Authorization = "Bearer " + accessToken;
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Export all instances of the APIs
export { gatewayApi };
