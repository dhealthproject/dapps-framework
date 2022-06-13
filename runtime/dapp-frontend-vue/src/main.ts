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

// internal dependencies
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./state/store";
import internalComponentsInstaller from "@dhealth/components";
import Meta from "vue-meta";

// importing compiled tailwind styles
// triggers a build when adding classes
import "../resources/scss/theme.scss";
import "@dhealth/components/dist/@dhealth/components.css";

// eslint-disable-next-line
const metaConfig = require("../config/meta.json");

Vue.use(internalComponentsInstaller);
Vue.use(Meta, metaConfig);

// create app instance
const dapp = new Vue({
  router,
  store,
  provide: () => ({ metaConfig }),
  render: (h) => h(App),
});

// start the app
dapp.$mount("#app");
