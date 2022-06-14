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

// internal dependencies
import "./registerServiceWorker";
import internalComponentsInstaller from "@dhealth/components";

// importing compiled tailwind styles
// triggers a build when adding classes
import "../resources/scss/theme.scss";
import "@dhealth/components/dist/@dhealth/components.css";

// importing @dhealth/components
Vue.use(internalComponentsInstaller);

// importing Vue plugins
Vue.use(VueMeta, { keyName: "metaInfo" });
Vue.use(VueRouter);

// initializes router
import router from "./router";

// initializes state
import store from "./state/store";

// defines App component
import App from "./App.vue";

// create app instance
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
