// import
import { createApp } from 'vue'
import App from './App.vue'
import plugin from '@dhealth/components';

// install
createApp(App)
  .use(plugin)
  .mount("#app");