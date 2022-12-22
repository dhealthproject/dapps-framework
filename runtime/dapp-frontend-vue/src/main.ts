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
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// segment analytics vue npm package
// https://www.npmjs.com/package/vue-segment-analytics
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueSegmentAnalytics from "vue-segment-analytics";

// internal dependencies
import "./registerServiceWorker";
import internalComponentsInstaller from "@dhealth/components";

// internal plugins
import imageUrl from "@/plugins/imageUrl";
import formatAddress from "./plugins/formatAddress";
import i18n from "./plugins/i18n";
import formatAmount from "./plugins/formatAmount";

// importing compiled tailwind styles
// triggers a build when adding classes
import "../resources/scss/theme.scss";
import "@dhealth/components/dist/@dhealth/components.css";

// importing @dhealth/components
Vue.use(internalComponentsInstaller);

// importing vSelect component
Vue.component("v-select", vSelect);

// importing Vue plugins
Vue.use(VueMeta, { keyName: "metaInfo" });
Vue.use(VueRouter);
Vue.use(Vuex);

// importing internal Vue plugins
Vue.use(imageUrl);
Vue.use(formatAddress);
Vue.use(i18n);
Vue.use(formatAmount);

// initializes router
import { createRouter } from "./router";

// initializes state
import { createStore } from "./state/store/Store";

// defines App component
import App from "./App.vue";

Vue.directive("click-outside", {
  bind: function (el: any, binding, vnode: any) {
    el.clickOutsideEvent = function (event: any) {
      // here I check that click was outside the el and his children
      if (
        !(el == event.target || el.contains(event.target)) &&
        binding !== undefined &&
        binding.expression !== undefined
      ) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind: function (el: any) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});

// importing Vue segment analytics plugin
// VUE_APP_SEGMENT_WRITE_KEY value can be found in your segment account
if (undefined !== process.env.VUE_APP_SEGMENT_WRITE_KEY) {
  const segmentApiKey = process.env.VUE_APP_SEGMENT_WRITE_KEY;
  Vue.use(VueSegmentAnalytics, {
    id: segmentApiKey,
  });
}

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
