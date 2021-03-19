import jwt_decode from "jwt-decode";

export const auth = {
    // Authentication module state
    state: {
        auth: {
            idToken: localStorage.getItem("idToken") || "",
            refreshToken: localStorage.getItem("refreshToken") || "",
            username: localStorage.getItem("username") || ""
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
        },
        setUsername(state: any, idToken: string) {
            // Extract username/email
            const token: any = jwt_decode(idToken);
            let username: string = token.email;
            
            // If username contains '@users.feirm.com', remove it
            const hasEmail = username.includes("@users.feirm.com");
            if (hasEmail) {
                username = username.replace("@users.feirm.com", "");
            }

            state.auth.username = username;
            localStorage.setItem("username", username);
        }
    },

    // Actions
    actions: {
        login({ commit }, { idToken, refreshToken }) {
            commit("setIdToken", idToken);
            commit("setRefreshToken", refreshToken);
            commit("setUsername", idToken);
        }
    },

    // Getters
    getters: {
        getIdToken: (state: any) => state.auth.idToken,
        getRefreshToken: (state: any) => state.auth.refreshToken,
        getUsername: (state: any) => state.auth.username,

        isLoggedIn: (getters: any) => {
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