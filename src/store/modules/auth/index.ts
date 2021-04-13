import jwt_decode from "jwt-decode";

export const auth = {
  // Authentication module state
  state: {
    auth: {
      accessToken: localStorage.getItem("accessToken") || "",
      refreshToken: localStorage.getItem("refreshToken") || "",
      username: localStorage.getItem("username") || ""
    }
  },

  // Mutations
  mutations: {
    setAccessToken(state: any, accessToken: string) {
      state.auth.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
    },
    setRefreshToken(state: any, refreshToken: string) {
      state.auth.refreshToken = refreshToken;
      localStorage.setItem("refreshToken", refreshToken);
    },
  },

  // Actions
  actions: {
    login({ commit }, { accessToken, refreshToken }) {
      commit("setAccessToken", accessToken);
      commit("setRefreshToken", refreshToken);
    }
  },

  // Getters
  getters: {
    getAccessToken: (state: any) => state.auth.accessToken,
    getRefreshToken: (state: any) => state.auth.refreshToken,

    isLoggedIn: (state: any) => {
      // If there is no access token, user is not logged in
      const token = state.auth.accessToken;
      if (!token) {
        return false;
      }

      // Decode the access token
      const decoded: any = jwt_decode(token);
      if (!decoded.exp) {
        return false;
      }

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);

      if (date > new Date()) {
        return true;
      }

      return false;
    }
  }
};
