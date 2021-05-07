import account from "@/class/account";

export const auth = {
  // Authentication module state
  state: {
    auth: {
      username: localStorage.getItem("username") || "",
      accessToken: localStorage.getItem("accessToken") || ""
    }
  },

  // Mutations
  mutations: {
    setUsername(state: any, username: string) {
      state.auth.username = username;
      localStorage.setItem("username", username);
    },
    setAccessToken(state: any, accessToken: string) {
      state.auth.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
    },

    logout(state: any) {
      state.auth.accessToken = "";
      state.auth.username = "";

      localStorage.removeItem("username");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("rootKey");
    }
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
    }
  },

  // Getters
  getters: {
    getUsername: (state: any) => state.auth.username,
    getAccessToken: (state: any) => state.auth.accessToken,

    isLoggedIn: (state: any) => {
      // If there is no access token, user is not logged in
      const token = state.auth.accessToken;
      if (!token) {
        return false;
      }

      // If a root key is not present, the user is not logged in
      const rootKey = account.getRootKey();
      if (!rootKey) {
        return false;
      }

      if (!token || !rootKey) {
        return false;
      }

      return true;
    }
  }
};
