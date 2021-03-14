import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouterView
} from "vue-router";

// Routes
import Index from "@/views/Index.vue";
import Signup from "@/views/app/auth/Signup.vue";

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
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
