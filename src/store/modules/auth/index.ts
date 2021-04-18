export const auth = {
  // Authentication module state
  state: {
    auth: {
      accessToken: localStorage.getItem("accessToken") || "",
    }
  },

  // Mutations
  mutations: {
    setAccessToken(state: any, accessToken: string) {
      state.auth.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
    },
  },

  // Actions
  actions: {
    login({ commit }, accessToken: string) {
      commit("setAccessToken", accessToken);
    }
  },

  // Getters
  getters: {
    getAccessToken: (state: any) => state.auth.accessToken,

    isLoggedIn: (state: any) => {
      // If there is no access token, user is not logged in
      const token = state.auth.accessToken;
      if (!token) {
        return false;
      }

      return true;
    }
  }
};
