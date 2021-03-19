export const auth = {
    // Authentication module state
    state: {
        auth: {
            idToken: localStorage.getItem("idToken") || ""
        }
    },

    // Mutations
    mutations: {
        setIdToken(state: any, idToken: any) {
            state.auth.idToken = idToken;
            localStorage.setItem("idToken", idToken);
        }
    },

    // Actions
    actions: {
        login({ commit }, idToken: any) {
            commit("setIdToken", idToken);
        }
    },

    // Getters
    getters: {
        getIdToken: (state: any) => state.auth.idToken
    }
}