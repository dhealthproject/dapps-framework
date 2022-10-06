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
  leaderBoardItems: LeaderBoardItem[];
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
    leaderBoardItems: [],
  }),

  getters: {
    getLeaderBoardItems: (state: LeaderBoardState): LeaderBoardItem[] =>
      state.leaderBoardItems,
  },

  mutations: {
    /**
     *
     */
    setLeaderBoardItems: (
      state: LeaderBoardState,
      leaderBoardItems: LeaderBoardItem[]
    ): any[] => (state.leaderBoardItems = leaderBoardItems),

    addLeaderBoardItem: (state: LeaderBoardState, item: LeaderBoardItem) =>
      state.leaderBoardItems.push(item),
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
            avatar: "avatar3.png",
            trendline: "up",
            userName: "IWKAD",
            activities: ["running", "cycling"],
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 2,
            assets: 1905,
            avatar: "avatar4.png",
            trendline: "down",
            userName: "YEIVJ",
            activities: ["swimming", "running"],
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 3,
            assets: 930,
            avatar: "avatar5.png",
            trendline: "up",
            userName: "NMWID",
            activities: ["running"],
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 4,
            assets: 543,
            avatar: "avatar6.png",
            trendline: "both",
            userName: "OWLFS",
            activities: ["swimming", "running", "cycling"],
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 5,
            assets: 102,
            avatar: "avatar7.png",
            trendline: "up",
            userName: "UENFA",
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 6,
            assets: 2050,
            avatar: "avatar3.png",
            trendline: "up",
            userName: "IWKAD",
            activities: ["running", "cycling"],
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 7,
            assets: 1905,
            avatar: "avatar4.png",
            trendline: "down",
            userName: "YEIVJ",
            activities: ["swimming", "running"],
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 8,
            assets: 930,
            avatar: "avatar5.png",
            trendline: "up",
            userName: "NMWID",
            activities: ["running"],
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 9,
            assets: 543,
            avatar: "avatar6.png",
            trendline: "both",
            userName: "OWLFS",
            activities: ["swimming", "running", "cycling"],
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 10,
            assets: 102,
            avatar: "avatar7.png",
            trendline: "up",
            userName: "UENFA",
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 11,
            assets: 2050,
            avatar: "avatar3.png",
            trendline: "up",
            userName: "IWKAD",
            activities: ["running", "cycling"],
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 12,
            assets: 1905,
            avatar: "avatar4.png",
            trendline: "down",
            userName: "YEIVJ",
            activities: ["swimming", "running"],
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 13,
            assets: 930,
            avatar: "avatar5.png",
            trendline: "up",
            userName: "NMWID",
            activities: ["running"],
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 14,
            assets: 543,
            avatar: "avatar6.png",
            trendline: "both",
            userName: "OWLFS",
            activities: ["swimming", "running", "cycling"],
          },
          {
            type: "leaderboard",
            period: "weekly",
            address: "addressGoesHere",
            position: 15,
            assets: 102,
            avatar: "avatar7.png",
            trendline: "up",
            userName: "UENFA",
          },
        ];
        items = mockedLeaderBoardItems;
      }

      context.commit("setLeaderBoardItems", items);
      return items;
    },
  },
};
