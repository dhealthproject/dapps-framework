/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

export interface AppState {
  name: string,
  version: number,
  language: string,
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})

export default createStore({
  /**
   * Forces the Vuex store into strict mode
   * @link https://devdocs.io/vuex~4/api/index#strict
   */
  strict: false, // Disable use-strict mode because it fails with SDK listeners.

  modules: {},
  state: {},
  getters: {},
  mutations: {},
  actions: {},
});
