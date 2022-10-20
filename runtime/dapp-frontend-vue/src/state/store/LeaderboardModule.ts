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
import {
  LeaderboardItem,
  LeaderboardService,
} from "../../services/LeaderboardService";

/**
 * @todo missing interface documentation
 */
export interface LeaderboardState {
  leaderboardItems: LeaderboardItem[];
}

/**
 * @todo missing interface documentation
 */
export interface LeaderboardPayload {
  which: string;
  period: string;
  vm?: any; // for a calling $root.$emit in case of error
}

/**
 * @todo missing interface documentation
 */
export type LeaderboardContext = ActionContext<LeaderboardState, RootState>;

/**
 * @todo missing interface documentation
 */
export const LeaderboardModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "app/getName".
  namespaced: true,
  state: (): LeaderboardState => ({
    leaderboardItems: [],
  }),

  getters: {
    getLeaderboardItems: (state: LeaderboardState): LeaderboardItem[] =>
      state.leaderboardItems,
  },

  mutations: {
    /**
     *
     */
    setLeaderboardItems: (
      state: LeaderboardState,
      leaderboardItems: LeaderboardItem[]
    ): any[] => (state.leaderboardItems = leaderboardItems),

    addLeaderboardItem: (state: LeaderboardState, item: LeaderboardItem) =>
      state.leaderboardItems.push(item),
  },

  actions: {
    /**
     *
     */
    async fetchLeaderboard(
      context: LeaderboardContext,
      payload: LeaderboardPayload
    ): Promise<void> {
      const handler = new LeaderboardService();
      let items: LeaderboardItem[] = [];

      try {
        items = await handler.getLeaderboard(payload.which, payload.period);
      } catch (err) {
        console.log("fetchLeaderboard", err);
        payload.vm.$root.$emit("toast", {
          state: "error",
          title: "Error appeared",
          description: "something went wrong",
          dismissTimeout: 10000,
        });
      }
    },
  },
};
