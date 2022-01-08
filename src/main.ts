import { createApp } from 'vue'
import App from './App.vue'

// Tailwind CSS
import '@/assets/css/index.css'

// Custom components
import Button from "@/components/elements/Button.vue";

const app = createApp(App);

app.component("b-button", Button);

app.mount('#app')
