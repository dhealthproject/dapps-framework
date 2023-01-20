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
import Vuex, { ActionContext } from "vuex";

// internal dependencies
import { AppModule } from "./AppModule";
import { AuthModule } from "./AuthModule";
import { AwaitLock } from "../AwaitLock";
import { OAuthModule } from "./OAuthModule";
import { LeaderboardModule } from "./LeaderboardModule";
import { StatisticsModule } from "./StatisticsModule";
import { ActivitiesModule } from "./ActivitiesModule";

/**
 * @interface RootState
 * @description This interface defines the *state* for the store.
 * <br /><br />
 * Following *inputs* apply to the {@link RootState} interface:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `initialized` | `boolean` | **Required** | Indicates whether this store has been initialized. |
 *
 * <br /><br />
 * @example Using the `RootState` interface
 * ```ts
 * // creating authentication contract inputs
 * const inputs = {
 *   initialized: true,
 * } as RootState;
 * ```
 * <br /><br />
 *
 * @since v0.6.3
 */
export interface RootState {
  initialized: boolean;
}

/**
 * @type RootContext
 * @description This type represents the context of this store.
 * <br /><br />
 * This type is to manage this store's states.
 *
 * @since v0.6.3
 */
export type RootContext = ActionContext<any, RootState>;

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 * @function createStore
 * @description Function to create a new Vuex store.
 * <br /><br />
 * The returned instance contains all necessary details for
 * the store, including state, getters, mutations and actions.
 *
 * @returns {Vuex.Store<RootState>}
 * @since v0.6.3
 */
export const createStore = () => {
  return new Vuex.Store<RootState>({
    /**
     * Forces the Vuex store into non-strict mode because
     * use-strict is not compatible with SDK listeners.
     *
     * @link https://devdocs.io/vuex~4/api/index#strict
     */
    strict: false,

    /**
     * Modules that this store contains.
     *
     * @access public
     * @var {object}
     */
    modules: {
      app: AppModule,
      auth: AuthModule,
      oauth: OAuthModule,
      leaderboard: LeaderboardModule,
      statistics: StatisticsModule,
      activities: ActivitiesModule,
    },

    /**
     * Function to create a new state for this store.
     *
     * @access public
     * @returns {RootState}
     */
    state: (): RootState => ({
      initialized: false,
    }),

    /**
     * The getter functions of this store.
     *
     * @access public
     * @var {object}
     */
    getters: {},

    /**
     * The mutation functions of this module.
     *
     * @access public
     * @var {object}
     */
    mutations: {
      /**
       * Mutation function to set the initialization status
       * to this store's state.
       *
       * @access public
       * @param {RootState} state
       * @param {boolean} payload
       * @returns {boolean}
       */
      setInitialized: (state: RootState, payload: boolean): boolean =>
        (state.initialized = payload),
    },

    /**
     * The action methods of this store.
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
       * @param {RootContext} context
       * @returns {Promise<boolean>}
       */
      async initialize(context: RootContext): Promise<boolean> {
        const callback = async () => {
          // dispatches for i18n and backend config
          await context.dispatch("app/initialize");

          // dispatches for authentication (access token)
          await context.dispatch("auth/initialize");

          // dispatches for integrations (OAuth, e.g. Strava)
          await context.dispatch("oauth/initialize");

          // done initializing
          context.commit("setInitialized", true);
        };

        // aquire async lock until initialized
        await Lock.initialize(callback, context);
        return true;
      },
    },
  });
};
