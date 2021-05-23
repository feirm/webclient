import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouterView,
} from "vue-router";

// Website
import Index from "@/views/Index.vue";
import Token from "@/views/Token.vue";
import Platform from "@/views/Platform.vue";

// App
import Signup from "@/views/app/auth/Signup.vue";
import Login from "@/views/app/auth/Login.vue";
import VerifyEmail from "@/views/app/auth/VerifyEmail.vue";
import ApproveLogin from "@/views/app/auth/ApproveLogin.vue";
import Migrate from "@/views/app/auth/Migrate.vue";

import Account from "@/views/app/account/Account.vue";

// Wallet
import WalletHome from "@/views/app/wallet/Wallet.vue";
import WalletIndex from "@/views/app/wallet/Index.vue";
import WalletNew from "@/views/app/wallet/New.vue";
import WalletRecovery from "@/views/app/wallet/Recovery.vue";

import { store } from "@/store";
import account from "@/class/account";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: Index,
  },
  {
    path: "/token",
    name: "Token",
    component: Token,
  },
  {
    path: "/platform",
    name: "Platform",
    component: Platform,
    meta: {
      title: "Platform",
    },
  },

  // App nested routes
  {
    path: "/app",
    component: RouterView,
    children: [
      {
        path: "",
        redirect: "/app/wallet",
        meta: {
          title: "Platform",
          authRequired: true,
        },
      },
      {
        path: "signup",
        component: Signup,
        meta: {
          title: "Signup",
          hideNavigation: true,
        },
      },
      {
        path: "login",
        component: Login,
        meta: {
          title: "Login",
          hideNavigation: true,
        },
      },
      {
        path: "login/migrate",
        component: Migrate,
        meta: {
          title: "Migrate",
          hideNavigation: true,
        },
      },
      {
        path: "user/verify-email",
        component: VerifyEmail,
        meta: {
          title: "Email Verification",
        },
      },
      {
        path: "login/approve",
        component: ApproveLogin,
        meta: {
          title: "Approve Login Request",
        },
      },
      {
        path: "account",
        component: Account,
        meta: {
          title: "My Account",
          authRequired: true,
        },
      },
      {
        path: "wallet",
        component: WalletIndex,
        meta: {
          title: "Wallet",
          authRequired: true,
        },
      },
      {
        path: "wallet/:ticker",
        component: WalletHome,
        meta: {
          title: "Wallet",
          authRequired: true,
        },
      },
      {
        path: "wallet/new",
        component: WalletNew,
        meta: {
          title: "New Wallet",
          authRequired: true,
        },
      },
      {
        path: "wallet/recovery",
        component: WalletRecovery,
        meta: {
          title: "Wallet Recovery",
          authRequired: true,
        },
      },
    ],
  },
];

// Create a router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
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

  if (to.matched.some((route) => route.meta.authRequired)) {
    // If not logged in, redirect to login page
    if (!loggedIn) {
      console.log("[Authentication] User is not logged in.");
      next({ path: "/app/login" });
    }

    // If there is no root key present, redirect to login page
    else if (rootKey.length === 0) {
      console.log("[Authentication] Root key not present in memory.");
      next({ path: "/app/login" });
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
