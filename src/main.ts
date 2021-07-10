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

// Custom components
import Button from "@/components/Button.vue";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(Toaster, { position: "bottom" });

app.component("b-button", Button);

app.mount("#app");
