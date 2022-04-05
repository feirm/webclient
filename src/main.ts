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

// FontAwesome icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(far);

// Custom components
import VueHcaptcha from "@hcaptcha/vue3-hcaptcha";
import Button from "@/components/Button.vue";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(Toaster, { position: "bottom" });

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("h-captcha", VueHcaptcha);
app.component("b-button", Button);

app.mount("#app");
