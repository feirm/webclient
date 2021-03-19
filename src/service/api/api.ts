import { store } from "@/store";
import axios from "axios";

// This file contains all the Axios instances for interacting with various APIs
// Create an instance for the Feirm Auth Microservice.
const authApi = axios.create({
    baseURL: "http://127.0.0.1:3000/api/",
    headers: {
        "Content-Type": "application/json",
    },
})

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

// Export all instances of the APIs
export {
    authApi
}