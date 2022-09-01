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
import { ActionContext } from "vuex";

// internal dependencies
import { RootState } from "./Store";
import { AwaitLock } from "../AwaitLock";

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
export type AppContext = ActionContext<AppState, RootState>;

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

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
    backendUrl: process.env.BACKEND_URL ?? "http://localhost:7903",
  }),

  getters: {
    getName: (state: AppState): string => state.name,
    getVersion: (state: AppState): string => state.version,
    getLanguage: (state: AppState): string => state.language,
    getBackendURL: (state: AppState): string => state.backendUrl,
  },

  actions: {
    /**
     *
     */
    async initialize(context: AppContext): Promise<boolean> {
      const callback = async () => {
        context.commit("setInitialized", true);
      };

      // aquire async lock until initialized
      await Lock.initialize(callback, context);
      return true;
    },
  },
};
