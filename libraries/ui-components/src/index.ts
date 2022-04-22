/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { TokenAmount } from "./components";

/**
 * Helper function to install the components library
 * on a Vue instance. The usage of Vue's `component()`
 * helper permits the installation using older Vue
 * versions as well as using Vue v3.
 *
 * @example Installing the library
 *
 * ```typescript
 *  import { createApp } from "vue";
 *  import App from "./App.vue";
 *  import plugin from "@dhealth/components";
 *
 *  createApp(App).use(plugin);
 * ```
 *
 * @param   {Vue}   $app    The Vue instance.
 * @returns {void}
 *
 * @since v0.1.0
 */
const install = ($app: any) => {
  $app.component(TokenAmount);
};

// exports the install helper alongside components
export default {
  install,
};

// exports the components classes as named-exports
export { TokenAmount };
