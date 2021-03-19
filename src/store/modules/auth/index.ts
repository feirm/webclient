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
        getRefreshToken: (state: any) => state.auth.refreshToken
    }
}