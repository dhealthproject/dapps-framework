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
import {
  DappAccountAvatar,
  DappAccountCard,
  DappButton,
  DappDate,
  DappIcon,
  DappMessage,
  DappQR,
  DappTitle,
  DappTokenAmount,
} from "./components";

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
  Vue.component("DappIcon", DappIcon);
  Vue.component("DappTitle", DappTitle);
  Vue.component("DappDate", DappDate);
  Vue.component("DappMessage", DappMessage);
  Vue.component("DappAccountAvatar", DappAccountAvatar);
  Vue.component("DappAccountCard", DappAccountCard);
};

import wrap from "../libs/dhealth-web-component-wrapper";
import * as allComponents from "./components";

const styles = document.styleSheets;
let styleStr = "";
[...styles].forEach((style) => {
  [...style.cssRules].forEach((rule) => {
    styleStr += rule.cssText;
  });
});
const styleEl = document.createElement("style");
styleEl.innerHTML = styleStr;

Object.entries(allComponents).forEach(([name, component]) => {
  const elName = "dapp-" + name.split("Dapp")[1].toLowerCase();
  const wrappedElement: any = wrap(Vue, component, styleEl);
  window.customElements.define(elName, wrappedElement as any);
});

// exports the install helper alongside components
export default {
  install,
};

// exports the components classes as named-exports
export {
  DappAccountAvatar,
  DappAccountCard,
  DappButton,
  DappDate,
  DappIcon,
  DappMessage,
  DappQR,
  DappTitle,
  DappTokenAmount,
};
