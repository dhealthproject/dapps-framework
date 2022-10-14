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
import { StatsConfig } from "@/components/Stats/Stats";
import { StatsService } from "@/services/StatsService";

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

export interface StatsModuleState {
  initialized: boolean;
  configuration: StatsConfig | undefined;
}

/**
 *
 */
export type StatusModuleContext = ActionContext<StatsModuleState, RootState>;

export const StatsModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "integrations/getIntegrations".
  namespaced: true,
  state: (): StatsModuleState => ({
    initialized: false,
    configuration: undefined,
  }),

  getters: {
    // isLoading: (state: OAuthModuleState): boolean => !state.initialized,
    getConfiguration: (state: StatsModuleState): StatsConfig | undefined => {
      // mock for testing display of earned $FIT
      // return {
      //   address: "wrerwrewrwer",
      //   period: "fsdfsdf",
      //   periodFormat: "D",
      //   totalPracticedMinutes: 1600,
      //   totalEarned: 120.95,
      //   topActivities: ["swimming"],
      //   totalReferral: 23,
      //   levelReferral: 5,
      // };
      return state.configuration;
    },
  },

  mutations: {
    /**
     *
     */
    setInitialized: (state: StatsModuleState, payload: boolean): boolean =>
      (state.initialized = payload),

    /**
     *
     */
    setConfiguration: (
      state: StatsModuleState,
      payload: StatsConfig
    ): StatsConfig => (state.configuration = payload),
  },

  actions: {
    /**
     *
     */
    async fetchStats(context: StatusModuleContext, address: string) {
      const service = new StatsService();
      try {
        const statsData = await service.getStats(address);
        context.commit("setConfiguration", statsData.data);
      } catch (err) {
        console.log("Error, stats/fetchStats:", err);
        throw err;
      }
    },

    /**
     *
     */
    async initialize(context: StatusModuleContext): Promise<boolean> {
      console.log({ context });

      const callback = async () => {
        // if quickstats are not loaded - trigger fetchStats
        if (!context.state.configuration) {
          // loads stats for current user
          await context.dispatch(
            "fetchStats",
            context.rootGetters["auth/getCurrentUserAddress"]
          );
        }

        // initialization is done after fetch
        context.commit("setInitialized", true);
      };
      // acquire async lock until initialized
      await Lock.initialize(callback, context);
      return true;
    },
  },
};
