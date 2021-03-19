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
  console.log("[Router] Logged in:", loggedIn);

  // If the user is not logged in, but has a refresh token, let them continue
  if (!loggedIn && store.getters.getRefreshToken) {
    return next();
  }

  // If the user is not logged in and has no refresh token, redirect them to
  // the login page
  if (!loggedIn && !store.getters.getRefreshToken) {
    return next("/app/login");
  }

  // Otherwise all them to go as usual
  return next();
});

// Export the router
export default router;
