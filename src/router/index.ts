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
router.beforeEach((to, from, next) => {
  const loggedIn = store.getters.isLoggedIn;
  const authRequired = to.matched.some(route => route.meta.authRequired);

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
