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
import { Translations } from "../../kernel/i18n/Translations";

// configuration
import packageConfig from "../../../package.json";
import dappConfig from "../../../config/dapp.json";

/**
 *
 */
export interface AppState {
  initialized: boolean;
  name: string;
  version: string;
  language: string;
  backendUrl: string;
  displaySnackBar: boolean;
  i18n: Translations;
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
    initialized: false,
    name: dappConfig.name,
    version: packageConfig.version,
    language: dappConfig.i18n.locale,
    backendUrl: process.env.VUE_APP_BACKEND_URL ?? "http://localhost:7903",
    displaySnackBar: false,
    i18n: new Translations(Translations.defaultLanguage),
  }),

  getters: {
    isLoading: (state: AppState): boolean => !state.initialized,
    hasSnackBar: (state: AppState): boolean => state.displaySnackBar,
    getName: (state: AppState): string => state.name,
    getVersion: (state: AppState): string => state.version,
    getLanguage: (state: AppState): string => state.language,
    getBackendURL: (state: AppState): string => state.backendUrl,
    i18n: (state: AppState): Translations => state.i18n,
  },

  mutations: {
    /**
     *
     */
    setInitialized: (state: AppState, payload: boolean): boolean =>
      (state.initialized = payload),

    /**
     *
     */
    setLanguage: (state: AppState, payload: string): string =>
      (state.language = payload),

    /**
     *
     */
    setTranslator: (state: AppState, payload: Translations): Translations =>
      (state.i18n = payload),

    /**
     *
     */
    enableSnackBar: (state: AppState): boolean =>
      (state.displaySnackBar = true),

    /**
     *
     */
    disableSnackBar: (state: AppState): boolean =>
      (state.displaySnackBar = false),
  },

  actions: {
    /**
     *
     */
    async initialize(context: AppContext): Promise<boolean> {
      const callback = async () => {
        // loads custom language settings
        await context.dispatch("fetchLanguage");

        // initialization is done after setup
        context.commit("setInitialized", true);
      };

      // acquire async lock until initialized
      await Lock.initialize(callback, context);
      return true;
    },

    /**
     *
     */
    fetchLanguage(context: AppContext): string {
      // reads language from localStorage
      const language = localStorage.getItem(Translations.storageKey) ?? "en";
      context.commit("setLanguage", language);
      context.commit("setTranslator", new Translations(language));
      return language;
    },

    /**
     *
     */
    translate(context: AppContext, key: string): string {
      const i18n = context.getters["i18n"];
      return i18n.$t(key);
    },
  },
};
