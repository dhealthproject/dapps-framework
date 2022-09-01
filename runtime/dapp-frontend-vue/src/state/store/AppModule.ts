/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vuex Store
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
// configuration
import packageConfig from "../../../package.json";
import dappConfig from "../../../config/dapp.json";

/**
 *
 */
export interface AppState {
  name: string;
  version: string;
  language: string;
  backendUrl: string;
}

/**
 *
 */
export const AppModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "app/getName".
  namespaced: true,
  state: (): AppState => ({
    name: dappConfig.name,
    version: packageConfig.version,
    language: dappConfig.i18n.locale,
    backendUrl: dappConfig.backend.url,
  }),

  getters: {
    getName: (state: AppState): string => state.name,
    getVersion: (state: AppState): string => state.version,
    getLanguage: (state: AppState): string => state.language,
    getBackendURL: (state: AppState): string => state.backendUrl,
  },
};
