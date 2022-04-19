import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { createMetaManager } from "vue-meta";
import metaConfig from "../meta.config.json";

createApp(App)
  .use(router)
  .use(store)
  .use(createMetaManager())
  .provide("metaConfig", metaConfig)
  .mount("#app");
