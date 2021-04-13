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

  const loggedIn = store.getters.isLoggedIn;
  const authRequired = to.matched.some(route => route.meta.authRequired);

  // If the account root isn't present, prompt for login
  if (!account.getRootKey()) {
    next("/app/login");
  }

  // If the user is not logged in, redirect them to the login page
  if (!loggedIn && authRequired) {
    next("/app/login");
  } else {
    next();
  }
});

// Export the router
export default router;
