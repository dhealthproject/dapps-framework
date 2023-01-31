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
import { AssetsModule } from "./RewardsModule";
import { NotificationsModule } from "./NotificationsModule";

/**
 * @todo missing interface documentation
 */
export interface RootState {
  initialized: boolean;
}

/**
 * @todo missing interface documentation
 */
export type RootContext = ActionContext<any, RootState>;

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 * @todo missing function documentation
 *
 * @param Vue
 * @returns
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

    modules: {
      app: AppModule,
      auth: AuthModule,
      oauth: OAuthModule,
      leaderboard: LeaderboardModule,
      statistics: StatisticsModule,
      activities: ActivitiesModule,
      assets: AssetsModule,
      notifications: NotificationsModule,
    },
    state: (): RootState => ({
      initialized: false,
    }),
    getters: {},

    mutations: {
      /**
       *
       */
      setInitialized: (state: RootState, payload: boolean): boolean =>
        (state.initialized = payload),
    },

    actions: {
      /**
       *
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
