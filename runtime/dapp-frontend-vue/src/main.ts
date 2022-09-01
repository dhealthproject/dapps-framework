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

// initializes router
import router from "./router";

// initializes state
import { createStore } from "./state/store/Store";

// defines App component
import App from "./App.vue";

// create app instance
new Vue({
  router,
  store: createStore(),
  render: (h) => h(App),
}).$mount("#app");
