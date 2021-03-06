import account from "@/class/account";

export const auth = {
  // Authentication module state
  state: {
    auth: {
      username: localStorage.getItem("username") || "",
      accessToken: localStorage.getItem("accessToken") || "",
    },
  },

  // Mutations
  mutations: {
    setUsername(state, username: string) {
      state.auth.username = username;
      localStorage.setItem("username", username);
    },
    setAccessToken(state, accessToken: string) {
      state.auth.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
    },

    logout(state) {
      state.auth.accessToken = "";
      state.auth.username = "";

      localStorage.removeItem("username");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("rootKey");
    },
  },

  // Actions
  actions: {
    login({ commit }, accessToken: string) {
      commit("setAccessToken", accessToken);
    },

    setUsername({ commit }, username: string) {
      commit("setUsername", username);
    },

    logout({ commit }) {
      commit("logout");
    },
  },

  // Getters
  getters: {
    getUsername: (state) => state.auth.username,
    getAccessToken: (state) => state.auth.accessToken,

    isLoggedIn: (state) => {
      // If there is no access token, user is not logged in
      const token = state.auth.accessToken;
      if (!token) {
        return false;
      }

      const rootKey = account.getRootKey();
      if (rootKey.length === 0) {
        return false;
      }

      return true;
    },
  },
};
