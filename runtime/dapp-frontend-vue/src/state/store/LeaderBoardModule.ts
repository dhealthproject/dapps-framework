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
import {
  LeaderBoardItem,
  LeaderBoardService,
} from "../../services/LeaderBoardService";

/**
 *
 */
export interface LeaderBoardState {
  liderBoardItems: LeaderBoardItem[];
}

export interface LeaderBoardPayload {
  which: string;
  period: string;
}

/**
 *
 */
export type LeaderBoardContext = ActionContext<LeaderBoardState, RootState>;

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 *
 */
export const LeaderBoardModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "app/getName".
  namespaced: true,
  state: (): LeaderBoardState => ({
    liderBoardItems: [],
  }),

  getters: {
    getLeaderBoardItems: (state: LeaderBoardState): LeaderBoardItem[] =>
      state.liderBoardItems,
  },

  mutations: {
    /**
     *
     */
    setLeaderBoardItems: (
      state: LeaderBoardState,
      leaderBoardItems: LeaderBoardItem[]
    ): any[] => (state.liderBoardItems = leaderBoardItems),

    addLeaderBoardItem: (state: LeaderBoardState, item: LeaderBoardItem) =>
      state.liderBoardItems.push(item),
  },

  actions: {
    /**
     *
     */
    async fetchLedaderBoard(
      context: LeaderBoardContext,
      payload: LeaderBoardPayload
    ): Promise<LeaderBoardItem[]> {
      const handler = new LeaderBoardService();
      let items: LeaderBoardItem[];

      try {
        items = await handler.getLeaderBoard(payload.which, payload.period);
      } catch (err) {
        console.log(err);
        // Temporary set items for state property untill get /leaderboard will be available
        const mockedLeaderBoardItems = [
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 1,
            assets: 2050,
            avatar: "avatar1.png",
            trendline: "up",
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 2,
            assets: 1905,
            avatar: "avatar2.png",
            trendline: "down",
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 3,
            assets: 930,
            avatar: "friend1.png",
            trendline: "up",
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 4,
            assets: 543,
            avatar: "friend2.png",
            trendline: "both",
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 4,
            assets: 102,
            avatar: "avatar1.png",
            trendline: "up",
          },
        ];
        items = mockedLeaderBoardItems;
      }

      context.commit("setLeaderBoardItems", items);
      return items;
    },
  },
};
