import jwt_decode from "jwt-decode";

export const auth = {
    // Authentication module state
    state: {
        auth: {
            idToken: localStorage.getItem("idToken") || "",
            refreshToken: localStorage.getItem("refreshToken") || ""
        }
    },

    // Mutations
    mutations: {
        setIdToken(state: any, idToken: string) {
            state.auth.idToken = idToken;
            localStorage.setItem("idToken", idToken);
        },
        setRefreshToken(state: any, refreshToken: string) {
            state.auth.refreshToken = refreshToken;
            localStorage.setItem("refreshToken", refreshToken);
        }
    },

    // Actions
    actions: {
        login({ commit }, { idToken, refreshToken }) {
            commit("setIdToken", idToken);
            commit("setRefreshToken", refreshToken);
        }
    },

    // Getters
    getters: {
        getIdToken: (state: any) => state.auth.idToken,
        getRefreshToken: (state: any) => state.auth.refreshToken,

        isLoggedIn: (state: any, getters: any) => {
            // If there is no access token, user is not logged in
            if (!getters.getIdToken) {
                return false;
            }

            // Decode the access token
            const token: any = jwt_decode(getters.getIdToken);
            if (!token.exp) {
                return false;
            }

            const date = new Date(0);
            date.setUTCSeconds(token.exp);

            if (date > new Date()) {
                return true;
            }

            return false;
        }
    }
}