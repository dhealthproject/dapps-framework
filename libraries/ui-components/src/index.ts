/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// This file is necessary to enable the installation of
// the library using built-in Vue (>= v2) software. This
// file makes sure that the library is recognized *and*
// registered as a Vue plugin ("middleware").

// Note: Any component released as part of this library
// **must** be registered and exported using this file.
import Vue from "vue";
import { DappButton, DappTokenAmount } from "./components";

// importing compiled tailwind styles
// triggers a build when adding classes
import "./theme.scss";

/**
 * Helper function to install the components library
 * on a Vue instance. The usage of Vue's `component()`
 * helper permits the installation using older Vue
 * versions as well as using Vue v3.
 *
 * @example Installing the library using Vue v3
 * ```typescript
 *  import { createApp } from "vue";
 *  import App from "./App.vue";
 *  import plugin from "@dhealth/components";
 *
 *  createApp(App).use(plugin);
 * ```
 *
 * @example Installing the library using Vue v2
 * ```typescript
 *  import Vue from "vue";
 *  import App from "./App.vue";
 *  import plugin from "@dhealth/components";
 *
 *  Vue.use(plugin);
 * ```
 *
 * @returns {void}
 *
 * @since v0.1.0
 */
const install = (): void => {
  // vue v2 and v3 compatible
  Vue.component("DappButton", DappButton);
  Vue.component("DappQR", DappQR);
  Vue.component("DappTokenAmount", DappTokenAmount);
};

// exports the install helper alongside components
export default {
  install,
};

// exports the components classes as named-exports
export { DappButton, DappTokenAmount };
