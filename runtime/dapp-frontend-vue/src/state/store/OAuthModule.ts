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
import { IntegrationsService } from "../../services/IntegrationsService";

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 * @interface OAuthParameters
 * @description This interface defines the *parameters* for the oauth module state.
 * <br /><br />
 * Following *inputs* apply to the {@link OAuthParameters} interface:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `code` | `string` | **Required** | The oauth code. |
 * | `state` | `string` | **Required** | The oauth state. |
 * | `scope` | `string` | **Required** | The oauth scope. |
 *
 * <br /><br />
 * @example Using the `OAuthParameters` interface
 * ```ts
 * // creating OAuthParameters inputs
 *   code: "...",
 *   state: "...",
 *   scope: "..."
 * } as OAuthParameters;
 * ```
 * <br /><br />
 *
 * @since v0.6.3
 */
export interface OAuthParameters {
  code: string;
  state: string;
  scope: string;
}

/**
 * @interface OAuthModuleState
 * @description This interface defines the *state* for the oauth module.
 * <br /><br />
 * Following *inputs* apply to the {@link OAuthModuleState} interface:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `initialized` | `boolean` | **Required** | Indicates whether module state has been initialized. |
 * | `integrations` | `string[]` | **Required** | The list of integration items. |
 * | `isIntegrating` | `boolean` | **Required** | Indicates whether the oauth module is integrating or not. |
 * | `oauthParameters` | `OAuthParameters` | **Required** | The oauth parameters as indicated in {@link OAuthParameters}. |
 *
 * <br /><br />
 * @example Using the `OAuthModuleState` interface
 * ```ts
 * // creating OAuthModuleState inputs
 * const inputs = {
 *   initialized: true,
 *   integrations: [
 *     "strava"
 *   ],
 *   isIntegrating: true,
 *   oauthParameters: {
 *     code: "...",
 *     state: "...",
 *     scope: "..."
 *   }
 * } as OAuthModuleState;
 * ```
 * <br /><br />
 *
 * @since v0.6.3
 */
export interface OAuthModuleState {
  initialized: boolean;
  integrations: string[];
  isIntegrating: boolean;
  oauthParameters: OAuthParameters;
}

/**
 * @type OAuthModuleContext
 * @description This type represents the context of the oauth module.
 * <br /><br />
 * This type is to manage oauth module's states.
 *
 * @since v0.6.3
 */
export type OAuthModuleContext = ActionContext<OAuthModuleState, RootState>;

/**
 * @constant OAuthModule
 * @description The oauth vuex module.
 * <br /><br />
 * This constant contains all necessary details for
 * the oauth module, including state, getters,
 * mutations and actions.
 *
 * @since v0.6.3
 */
export const OAuthModule = {
  /**
   * This store module is namespaced, meaning the
   * module name must be included when calling a
   * mutation, getter or action, i.e. "integrations/getIntegrations".
   *
   * @access public
   * @var {boolean}
   */
  namespaced: true,

  /**
   * Function to create a new state for this module.
   *
   * @access public
   * @returns {OAuthModuleState}
   */
  state: (): OAuthModuleState => ({
    initialized: false,
    integrations: [],
    isIntegrating: false,
    oauthParameters: {} as OAuthParameters,
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
     * @param {OAuthModuleState} state
     * @returns {boolean}
     */
    isLoading: (state: OAuthModuleState): boolean => !state.initialized,

    /**
     * Getter to return the integration status from the module's state.
     *
     * @access public
     * @param {OAuthModuleState} state
     * @returns {boolean}
     */
    isIntegrating: (state: OAuthModuleState): boolean => state.isIntegrating,

    /**
     * Getter to return the integration list from the module's state.
     *
     * @access public
     * @param {OAuthModuleState} state
     * @returns {string[]}
     */
    getIntegrations: (state: OAuthModuleState): string[] => state.integrations,

    /**
     * Getter to return the oauth parameters from the module's state
     * as defined in {@link OAuthParameters}.
     *
     * @access public
     * @param {OAuthModuleState} state
     * @returns {OAuthParameters}
     */
    getParameters: (state: OAuthModuleState): OAuthParameters =>
      state.oauthParameters,
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
     * @param {OAuthModuleState} state
     * @param {boolean} payload
     * @returns {boolean}
     */
    setInitialized: (state: OAuthModuleState, payload: boolean): boolean =>
      (state.initialized = payload),

    /**
     * Mutation function to set the integration list
     * to current module state.
     *
     * @access public
     * @param {OAuthModuleState} state
     * @param {string[]} payload
     * @returns {string[]}
     */
    setIntegrations: (state: OAuthModuleState, payload: string[]): string[] =>
      (state.integrations = payload),

    /**
     * Mutation function to set the integration status
     * to current module state.
     *
     * @access public
     * @param {OAuthModuleState} state
     * @param {boolean} payload
     * @returns {boolean}
     */
    setIntegrating: (state: OAuthModuleState, payload: boolean): boolean =>
      (state.isIntegrating = payload),

    /**
     * Mutation function to set the oauth parameters
     * to current module state (as defined in {@link OAuthParameters}).
     *
     * @access public
     * @param {OAuthModuleState} state
     * @param {OAuthParameters} payload
     * @returns {OAuthParameters}
     */
    setParameters: (
      state: OAuthModuleState,
      payload: OAuthParameters
    ): OAuthParameters => (state.oauthParameters = payload),
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
     * @param {ActivitiesContext} context
     * @returns {Promise<boolean>}
     */
    async initialize(context: OAuthModuleContext): Promise<boolean> {
      const callback = async () => {
        // loads integrations for current user
        await context.dispatch("fetchIntegrations");

        // initialization is done after fetch
        context.commit("setInitialized", true);
      };

      // acquire async lock until initialized
      await Lock.initialize(callback, context);
      return true;
    },

    /**
     * Action method to fetch the integration list and
     * update the module's current state.
     *
     * @access public
     * @async
     * @param {OAuthModuleContext} context
     * @returns {Promise<string[]>}
     */
    async fetchIntegrations(context: OAuthModuleContext): Promise<string[]> {
      // reads from localStorage
      const fromStorage = localStorage.getItem("integrations");
      if (null === fromStorage) {
        return [];
      }

      // parse content and mutate state
      const integrations = JSON.parse(fromStorage);
      context.commit("setIntegrations", integrations);
      return integrations;
    },

    /**
     * Action method to authorize the integration and
     * update the module's current state.
     *
     * @todo This method currently works with strava only.
     *
     * @access public
     * @param {OAuthModuleContext} context
     * @param {string} address
     * @returns {void}
     */
    authorize(context: OAuthModuleContext, address: string): void {
      if (!address || !address.length) {
        throw new Error(`Invalid user address, must not be empty.`);
      }

      context.commit("setIntegrating", true);
      window.location.href =
        process.env.VUE_APP_BACKEND_URL +
        `/oauth/strava/authorize?&dhealthAddress=${address}`;
    },

    /**
     * Action method to perform a callback operation from the integration.
     *
     * @access public
     * @async
     * @param {OAuthModuleContext} context
     * @param {string} address
     * @returns {Promise<void>}
     */
    async callback(
      context: OAuthModuleContext,
      address: string
    ): Promise<void> {
      if (!address || !address.length) {
        throw new Error(`Invalid user address, must not be empty.`);
      }

      const service = new IntegrationsService();
      const parameters = context.state.oauthParameters;
      try {
        // strava is the only provider currently
        await service.callback("strava", parameters);
        console.log("Provider linked successfully");
      } catch (err) {
        console.log("[store/OAuthModule] Error in callback action: ", err);
      }
    },

    /**
     * Action method to perform a deauthorization operation
     * to the integration provider.
     *
     * @access public
     * @param {OAuthModuleContext} context
     * @param {string} provider
     * @returns {void}
     */
    deauthorize(context: OAuthModuleContext, provider: string): void {
      // reads current state of "integrations"
      const integrations = context.state.integrations;

      // removes the integration and mutates
      if (integrations.length && integrations.includes(provider)) {
        context.commit(
          "setIntegrations",
          integrations.filter((i) => i !== provider)
        );
      }
    },
  },
};
