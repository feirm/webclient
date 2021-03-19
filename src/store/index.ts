import { createStore } from "vuex";

// Modules
import { auth } from "@/store/modules/auth";

export const store = createStore({
  modules: {
    auth
  }
});
