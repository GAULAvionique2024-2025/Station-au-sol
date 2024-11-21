import "./assets/scss/style.scss";
import { createPinia } from "pinia";
import { createApp } from "vue";
import "@/assets/scss/style.scss";
import router from "./router";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");
