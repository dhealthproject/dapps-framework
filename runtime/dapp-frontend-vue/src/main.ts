/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import Vue from "vue";
import VueMeta from "vue-meta";
import VueRouter from "vue-router";
import Vuex from "vuex";

// internal dependencies
import "./registerServiceWorker";
import internalComponentsInstaller from "@dhealth/components";

// internal plugins
import imageUrl from "@/plugins/imageUrl";
import formatAddress from "./plugins/formatAddress";
import i18n from "./plugins/i18n";

// importing compiled tailwind styles
// triggers a build when adding classes
import "../resources/scss/theme.scss";
import "@dhealth/components/dist/@dhealth/components.css";

// importing @dhealth/components
Vue.use(internalComponentsInstaller);

// importing Vue plugins
Vue.use(VueMeta, { keyName: "metaInfo" });
Vue.use(VueRouter);
Vue.use(Vuex);

// importing internal Vue plugins
Vue.use(imageUrl);
Vue.use(formatAddress);
Vue.use(i18n);

// initializes router
import { createRouter } from "./router";

// initializes state
import { createStore } from "./state/store/Store";

// defines App component
import App from "./App.vue";

/**
 * This helper creates a `vue` instance using a `vuex` store
 * and a `vue-router` router. The {@link App} component when
 * mounted, displays a `<router-view>` that initializes the
 * navigation in-app.
 * <br /><br />
 * Note that *before creating the app*, we run the **root** state
 * initialization action such that the app can be populated
 * with the correct initialization state.
 *
 * @returns   {Vue}
 */
const createApp = async () => {
  // creates the store instance
  const store = createStore();

  // waits for store state update, this *must* happen
  // before the app is mounted, to avoid "flickering"
  // into wrong route components due to unset auth.
  // dispatches the *root* state initialization action
  await store.dispatch("initialize");

  // create a Vue instance
  const app = new Vue({
    router: createRouter(store),
    store,
    render: (h) => h(App),
  });

  // start mount process
  app.$mount("#app");
  return app;
};

createApp();
