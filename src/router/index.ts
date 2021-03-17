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

// Bridge
import BridgeIndex from "@/views/app/bridge/Index.vue";

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

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
