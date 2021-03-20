import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouterView
} from "vue-router";

// Website
import Index from "@/views/Index.vue";

// App
import Signup from "@/views/app/auth/Signup.vue";
import Login from "@/views/app/auth/Login.vue";
import Unlock from "@/views/app/auth/Unlock.vue";
import VerifyEmail from "@/views/app/auth/VerifyEmail.vue";

import Protected from "@/views/app/Protected.vue";

// Bridge
import BridgeIndex from "@/views/app/bridge/Index.vue";
import { store } from "@/store";
import account from "@/class/account";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: Index
  },

  // App nested routes
  {
    path: "/app",
    component: RouterView,
    children: [
      {
        path: "",
        component: Protected,
        meta: {
          authRequired: true
        }
      },
      {
        path: "signup",
        component: Signup,
        meta: {
          hideNavigation: true
        }
      },
      {
        path: "login",
        component: Login,
        meta: {
          hideNavigation: true
        }
      },
      {
        path: "email",
        component: VerifyEmail,
        meta: {
          hideNavigation: true
        }
      },
      {
        path: "unlock",
        component: Unlock,
        meta: {
          authRequired: true
        }
      }
    ]
  },

  // Bridge nested routes
  {
    path: "/bridge",
    component: RouterView,
    children: [
      {
        path: "",
        component: BridgeIndex
      }
    ]
  }
];

// Create a router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// For every route, check if the user is authenticate
router.beforeEach(async(to, from, next) => {
  const loggedIn = store.getters.isLoggedIn;
  const authRequired = to.matched.some(route => route.meta.authRequired);
  const encryptedAccount = await account.fetchAccount();

  // Avoid router loop by checking they didn't come from the unlock page
  if (to.path !== "/app/unlock") {
    // If they are going to any of the '/app' routes, check they are unlocked
    if (to.path.includes("/app")) {
      // If the user is logged in, has a refresh token available, their encrypted account on disk,
      // but no root key in memory, then request for an unlock.
      if (loggedIn && store.getters.getRefreshToken && encryptedAccount && !account.rootKey) {
        next("/app/unlock");
      }
    }
  }

  // If the user is not logged in and has no refresh token, redirect them to
  // the login page
  if (!loggedIn && authRequired && !store.getters.getRefreshToken) {
    next("/app/login");
  } else {
    next();
  }
});

// Export the router
export default router;
