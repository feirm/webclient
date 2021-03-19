import { store } from "@/store";
import axios from "axios";
import fbService from "./fbService";

// This file contains all the Axios instances for interacting with various APIs
// Create an instance for the Feirm Auth Microservice.
const authApi = axios.create({
    baseURL: "http://127.0.0.1:3000/api/",
    headers: {
        "Content-Type": "application/json",
    },
})

// Attach Authorization header to requests
authApi.interceptors.request.use(
    (config) => {
        const idToken = store.getters.getIdToken;

        if (idToken) {
            config.headers.Authorization = "Bearer " + idToken
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// Handle unauthorized responses by using the refresh token
authApi.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle the unauthorized request if it isn't a retry
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Fetch the existing refresh token
            const refreshToken = store.getters.getRefreshToken;

            // Request for new ID tokens and refresh token
            const tokenResponse = await fbService.getNewIdToken(refreshToken);
            const idToken = tokenResponse.data.id_token;
            const newRefreshToken = tokenResponse.data.refresh_token;

            // Update the refresh and access tokens in Vuex
            store.dispatch('login', { idToken, newRefreshToken });

            // Update the Authorization header on the original request
            originalRequest.headers.Authorization = "Bearer " + idToken;
            return axios(originalRequest);
        }

        return Promise.reject(error);
    }
)

// Firebase accounts API
const API_KEY = "AIzaSyBKPqBFtNyw_P1kdz48JTW2Zqm5Vvrn8E0"; // Make this value accessible somewhere (maybe env vars)
const firebaseApi = axios.create({
    baseURL: "https://securetoken.googleapis.com/v1/token?key=" + API_KEY,
    headers: {
        "Content-Type": "application/json",
    }
})


// Export all instances of the APIs
export {
    authApi,
    firebaseApi
}