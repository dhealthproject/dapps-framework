/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// import InjectionKey from "vue";
import Vuex from "vuex";
import Vue from "vue";

export interface AppState {
  name: string;
  version: number;
  language: string;
}

// export const key: InjectionKey<Store<AppState>> = Symbol();
export const key = Symbol();

// export const store = createStore<State>({
//   state: {
//     count: 0
//   }
// })

Vue.use(Vuex);

const store = new Vuex.Store({
  /**
   * Forces the Vuex store into non-strict mode because
   * use-strict is not compatible with SDK listeners.
   *
   * @link https://devdocs.io/vuex~4/api/index#strict
   */
  strict: false,

  modules: {},
  state: {},
  getters: {},
  mutations: {},
  actions: {},
});

export default store;
