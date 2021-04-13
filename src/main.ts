import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "@/store";

// Service worker
import "@/registerServiceWorker";

// Toast Notification
import Toaster from "@meforma/vue-toaster";

// CSS Styles (Tailwind)
import "@/css/index.css";

createApp(App)
  .use(store)
  .use(router)
  .use(Toaster, { position: "bottom" })
  .mount("#app");
