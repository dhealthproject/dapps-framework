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
import { SocialService } from "../../services/SocialService";
import { ConfigService } from "../../services/ConfigService";
import { SocialPlatformDTO } from "../../models/SocialPlatformDTO";
import { ConfigDTO } from "../../models/ConfigDTO";

// configuration
import packageConfig from "../../../package.json";
import dappConfig from "../../../config/dapp.json";

// Union type for configuration
export type ConfigType = ConfigDTO | undefined;

/**
 * @interface AppState
 * @description This interface defines the *state* for the app module.
 * <br /><br />
 * Following *inputs* apply to the {@link AppState} interface:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `initialized` | `boolean` | **Required** | Indicates whether app state has been initialized. |
 * | `name` | `string` | **Required** | The name of this app. |
 * | `version` | `string` | **Required** | The version of this app. |
 * | `language` | `string` | **Required** | The language of this app. |
 * | `backendUrl` | `string` | **Required** | The backend url of this app. |
 * | `displaySnackBar` | `boolean` | **Required** | Indicates whether to display the snack bar for this app or not. |
 * | `i18n` | `Translations` | **Required** | The {@link Translation} instance of this app. |
 * | `socialApps` | `SocialPlatformDTO[]` | **Required** | The list of available social platforms of this app as defined in {@link SocialPlatformDTO}. |
 * | `config` | `ConfigType` | **Required** | The config values of this app as defined in {@link ConfigType} . |
 *
 * <br /><br />
 * @example Using the `AppState` interface
 * ```ts
 * // creating authentication contract inputs
 * const inputs = {
 *   initialized: true,
 *   name: "elevate",
 *   version: "1.0.0",
 *   language: "en",
 *   i18n: new Translations("en"),
 *   socialApps: [
 *     {
 *       icon: "...";
 *       shareUrl: "...";
 *       title?: "...";
 *       profileUrl?: "...";
 *       appUrl?: "...";
 *     } as SocialPlatformDTO
 *   ],
 *   config: {
 *     dappName: "elevate";
 *     authRegistry: "...";
 *     earnAssetDivisibility: 6;
 *     earnAssetIdentifier: "...";
 *     referralLevels: { minReferred: 10 }[];
 *   }
 * } as AppState;
 * ```
 * <br /><br />
 *
 * @since v0.6.3
 */
export interface AppState {
  initialized: boolean;
  name: string;
  version: string;
  language: string;
  backendUrl: string;
  displaySnackBar: boolean;
  i18n: Translations;
  socialApps: SocialPlatformDTO[];
  config: ConfigType;
}

/**
 * @type AppContext
 * @description This type represents the context of the app module.
 * <br /><br />
 * This type is to manage app module's states.
 *
 * @since v0.6.3
 */
export type AppContext = ActionContext<AppState, RootState>;

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 * @constant AppModule
 * @description The app vuex module.
 * <br /><br />
 * This constant contains all necessary details for
 * this app, including state, getters,
 * mutations and actions.
 *
 * @since v0.6.3
 */
export const AppModule = {
  /**
   * This store module is namespaced, meaning the
   * module name must be included when calling a
   * mutation, getter or action, i.e. "app/getName".
   *
   * @access public
   * @var {boolean}
   */
  namespaced: true,

  /**
   * Function to create a new state for this module.
   *
   * @access public
   * @returns {AppState}
   */
  state: (): AppState => ({
    initialized: false,
    name: dappConfig.name,
    version: packageConfig.version,
    language: dappConfig.i18n.locale,
    backendUrl: process.env.VUE_APP_BACKEND_URL ?? "http://localhost:7903",
    displaySnackBar: false,
    i18n: new Translations(Translations.defaultLanguage),
    socialApps: [],
    config: undefined,
  }),

  /**
   * The getter functions of this module instance.
   *
   * @access public
   * @var {object}
   */
  getters: {
    /**
     * Getter to return the initialization status from the module's state.
     *
     * @access public
     * @param {AppState} state
     * @returns {boolean}
     */
    isLoading: (state: AppState): boolean => !state.initialized,

    /**
     * Getter to return this module's preference of whether to display
     * the snack bar or not.
     *
     * @access public
     * @param {AppState} state
     * @returns {boolean}
     */
    hasSnackBar: (state: AppState): boolean => state.displaySnackBar,

    /**
     * Getter to return this app's name from the current state.
     *
     * @access public
     * @param {AppState} state
     * @returns {string}
     */
    getName: (state: AppState): string => state.name,

    /**
     * Getter to return this app's version from the current state.
     *
     * @access public
     * @param {AppState} state
     * @returns {string}
     */
    getVersion: (state: AppState): string => state.version,

    /**
     * Getter to return this app's language from the current state.
     *
     * @access public
     * @param {AppState} state
     * @returns {string}
     */
    getLanguage: (state: AppState): string => state.language,

    /**
     * Getter to return this app's backend url from the current state.
     *
     * @access public
     * @param {AppState} state
     * @returns {string}
     */
    getBackendURL: (state: AppState): string => state.backendUrl,

    /**
     * Getter to return this app's {@link Translations} instance
     * from the current state.
     *
     * @access public
     * @param {AppState} state
     * @returns {Translations}
     */
    i18n: (state: AppState): Translations => state.i18n,

    /**
     * Getter to return this app's list of available social platforms
     * from the current state.
     *
     * @access public
     * @param {AppState} state
     * @returns {SocialPlatformDTO[]}
     */
    socialApps: (state: AppState): SocialPlatformDTO[] => state.socialApps,

    /**
     * Getter to return this app's {@link ConfigType} instance
     * from the current state.
     *
     * @access public
     * @param {AppState} state
     * @returns {ConfigType}
     */
    getConfig: (state: AppState): ConfigType => state.config,
  },

  /**
   * The mutation functions of this module.
   *
   * @access public
   * @var {object}
   */
  mutations: {
    /**
     * Mutation function to set the initialization status
     * to current module state.
     *
     * @access public
     * @param {AppState} state
     * @param {boolean} payload
     * @returns {boolean}
     */
    setInitialized: (state: AppState, payload: boolean): boolean =>
      (state.initialized = payload),

    /**
     * Mutation function to set the language value
     * to current module state.
     *
     * @access public
     * @param {AppState} state
     * @param {string} payload
     * @returns {string}
     */
    setLanguage: (state: AppState, payload: string): string =>
      (state.language = payload),

    /**
     * Mutation function to set the {@link Translation} instance
     * to current module state.
     *
     * @access public
     * @param {AppState} state
     * @param {Translations} payload
     * @returns {Translations}
     */
    setTranslator: (state: AppState, payload: Translations): Translations =>
      (state.i18n = payload),

    /**
     * Mutation function to set the preference of enabling the snack bar
     * to current module state.
     *
     * @access public
     * @param {AppState} state
     * @returns {boolean}
     */
    enableSnackBar: (state: AppState): boolean =>
      (state.displaySnackBar = true),

    /**
     * Mutation function to set the preference of disabling the snack bar
     * to current module state.
     *
     * @access public
     * @param {AppState} state
     * @returns {boolean}
     */
    disableSnackBar: (state: AppState): boolean =>
      (state.displaySnackBar = false),

    /**
     * Mutation function to set the list of available social platforms
     * to current module state.
     *
     * @access public
     * @param {AppState} state
     * @param {SocialPlatformDTO[]} payload
     * @returns {SocialPlatformDTO[]}
     */
    setSocialPlatforms: (state: AppState, payload: SocialPlatformDTO[]): SocialPlatformDTO[] =>
      (state.socialApps = payload),

    /**
     * Mutation function to set the {@link ConfigType} instance
     * to current module state.
     *
     * @access public
     * @param {AppState} state
     * @param {ConfigType} payload
     * @returns {ConfigType}
     */
    setConfig: (state: AppState, payload: ConfigType): ConfigType =>
      (state.config = payload),
  },

  /**
   * The action methods of this module.
   *
   * @access public
   * @var {object}
   */
  actions: {
    /**
     * Action method to initialize the module.
     *
     * @access public
     * @async
     * @param {AppContext} context
     * @returns {Promise<boolean>}
     */
    async initialize(context: AppContext): Promise<boolean> {
      const callback = async () => {
        // load dapp configuration from the backend
        await context.dispatch("fetchConfig");

        // loads custom language settings
        await context.dispatch("fetchLanguage");

        // loads available social networks for share
        await context.dispatch("fetchSocialPlatforms");

        // initialization is done after setup
        context.commit("setInitialized", true);
      };

      // acquire async lock until initialized
      await Lock.initialize(callback, context);
      return true;
    },

    /**
     * Action method to fetch the language and
     * update the module's current state.
     *
     * @access public
     * @param {AppContext} context
     * @returns {string}
     */
    fetchLanguage(context: AppContext): string {
      // reads language from localStorage
      const language = localStorage.getItem(Translations.storageKey) ?? "en";
      context.commit("setLanguage", language);
      context.commit("setTranslator", new Translations(language));
      return language;
    },

    /**
     * Action method to translate a key to the current state's language.
     *
     * @access public
     * @param {AppContext} context
     * @param {string} key
     * @returns {string}
     */
    translate(context: AppContext, key: string): string {
      const i18n = context.getters["i18n"];
      return i18n.$t(key);
    },

    /**
     * Action method to fetch the available social platforms and
     * update the module's current state.
     *
     * @access public
     * @async
     * @param {AppContext} context
     * @returns {SocialPlatformDTO[] | void}
     */
    async fetchSocialPlatforms(context: AppContext): Promise<SocialPlatformDTO[] | void> {
      const handler = new SocialService();
      try {
        const items = await handler.getSocialPlatforms();
        context.commit("setSocialPlatforms", items);
        return items;
      } catch (err) {
        console.log("ERROR fetchSocialPlatforms", err);
      }
    },

    /**
     * Action method to fetch the {@link ConfigType} instance and
     * update the module's current state.
     *
     * @access public
     * @async
     * @param {AppContext} context
     * @returns {ConfigType}
     */
    async fetchConfig(context: AppContext): Promise<ConfigType> {
      if (!context.getters.getConfig) {
        const handler = new ConfigService();
        try {
          const response = await handler.getConfig();
          context.commit("setConfig", response);
          context.commit("auth/setAuthRegistry", response.authRegistry[0], {
            root: true,
          });
          return response;
        } catch (err) {
          console.log("ERROR fetchConfig", err);
        }
      }
    },
  },
};
