import { createRouter, createWebHistory, RouteRecordRaw, RouterView } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: () => import("@/views/Index.vue")
  },
  
  // App nested routes
  {
    path: "/app",
    component: RouterView,
    children: [
      {
        path: "signup",
        component: () => import("@/views/app/auth/Signup.vue"),
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
