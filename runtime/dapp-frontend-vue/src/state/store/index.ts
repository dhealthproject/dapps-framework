/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vuex Store
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import Vuex from "vuex";

// internal dependencies
import { AppModule } from "./AppModule";

/**
 *
 * @param Vue
 * @returns
 */
export const createStore = () => {
  return new Vuex.Store({
    /**
     * Forces the Vuex store into non-strict mode because
     * use-strict is not compatible with SDK listeners.
     *
     * @link https://devdocs.io/vuex~4/api/index#strict
     */
    strict: false,

    modules: {
      app: AppModule,
    },
    state: {},
    getters: {},
    mutations: {},
    actions: {},
  });
};
