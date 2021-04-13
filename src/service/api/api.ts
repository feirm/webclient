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
      config.headers.Authorization = "Bearer " + accessToken;
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

      // Fetch the existing refresh token
      const refreshToken = store.getters.getRefreshToken;

      // Request for new token pair from auth API
      const tokens = await authService.RefreshTokens(refreshToken);
      const accessToken = tokens.data.access_token;
      const newRefreshToken = tokens.data.refresh_token;

      // Update the refresh and access tokens in Vuex
      store.dispatch("login", { accessToken, newRefreshToken });

      // Update the Authorization header on the original request
      originalRequest.headers.Authorization = "Bearer " + accessToken;
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Export all instances of the APIs
export { gatewayApi };
