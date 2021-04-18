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
          title: "Platform",
          authRequired: true
        }
      },
      {
        path: "signup",
        component: Signup,
        meta: {
          title: "Signup",
          hideNavigation: true
        }
      },
      {
        path: "login",
        component: Login,
        meta: {
          title: "Login",
          hideNavigation: true
        }
      },
      {
        path: "user/verify-email",
        component: VerifyEmail,
        meta: {
          title: "Email Verification"
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
        component: BridgeIndex,
        meta: {
          title: "Bridge"
        }
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
router.beforeEach(async (to, from, next) => {
  // Dynamic page titles
  const DEFAULT_TITLE = "Feirm";
  const PAGE_TITLE = to.meta.title;

  if (PAGE_TITLE) {
    document.title = DEFAULT_TITLE + " | " + to.meta.title;
  } else {
    document.title = DEFAULT_TITLE;
  }

  const rootKey = account.getRootKey();
  const loggedIn = store.getters.isLoggedIn;
  
  if (to.matched.some(route => route.meta.authRequired)) {
    // If not logged in, redirect to login page
    if (!loggedIn) {
      console.log("[Authentication] User is not logged in.")
      next({ path: "/app/login" });
    }

    // If there is no root key present, redirect to login page
    else if (rootKey.length === 0) {
      console.log("[Authentication] Root key not present in memory.")
      next({ path: "/app/login" })
    }
    
    // Continue as normal
    else {
      next();
    }
  } else {
    next();
  }
});

// Export the router
export default router;
