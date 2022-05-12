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
import { createApp } from "vue";
import { createMetaManager } from "vue-meta";

// internal dependencies
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./state/store";
import internalComponentsInstaller from "@dhealth/components";

// importing compiled tailwind styles
// triggers a build when adding classes
import "../resources/scss/theme.scss";
import "@dhealth/components/dist/@dhealth/components.css";

// eslint-disable-next-line
const metaConfig = require("../config/meta.json");

// create app instance
const dapp = createApp(App)
  .use(internalComponentsInstaller)
  .use(router)
  .use(store)
  .use(createMetaManager())
  .provide("metaConfig", metaConfig);

// start the app
dapp.mount("#app");
