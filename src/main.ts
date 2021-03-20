import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "@/store";

// Toast Notification
import Toaster from "@meforma/vue-toaster";

// Firebase
import firebase from "firebase/app";
import "firebase/auth";

// CSS Styles (Tailwind)
import "@/css/index.css";

// Firebase Authentication
const firebaseConfig = {
  apiKey: "AIzaSyBKPqBFtNyw_P1kdz48JTW2Zqm5Vvrn8E0",
  authDomain: "auth.feirm.com",
  projectId: "feirm-b4e50"
};

// Initialise Firebase
firebase.initializeApp(firebaseConfig);

createApp(App)
  .use(store)
  .use(router)
  .use(Toaster, { position: "bottom" })
  .mount("#app");
