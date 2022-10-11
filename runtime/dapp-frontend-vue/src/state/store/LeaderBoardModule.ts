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
  vm?: any; // for a calling $root.$emit in case of error
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
    async fetchLeaderBoard(
      context: LeaderBoardContext,
      payload: LeaderBoardPayload
    ): Promise<LeaderBoardItem[]> {
      const handler = new LeaderBoardService();
      let items: LeaderBoardItem[] = [];

      try {
        items = await handler.getLeaderBoard(payload.which, payload.period);
      } catch (err) {
        console.log("fetchLeaderBoard", err);
        payload.vm.$root.$emit("toast", {
          state: "error",
          title: "Error appeared",
          description: "something went wrong",
          dismissTimeout: 10000,
        });
      }

      // Temporary set items for state property untill get /leaderboard will provide some real data
      const mockedLeaderBoardItems = [
        {
          type: "leaderboard",
          period: "weekly",
          address: "NATZJE-TZTZCG-GRBUYV-QRBEUF-N5LEGD-RSTNF2-GYA",
          position: 1,
          assets: 2050,
          avatar: "avatar3.png",
          trendline: "up",
          activities: ["running", "cycling"],
          color: "#EEC52A",
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NCZMEJ-DHGFCD-MG4C56-SN4VVJ-B7EGJ3-PVDUUE-HPY",
          position: 2,
          assets: 1905,
          avatar: "avatar4.png",
          trendline: "down",
          activities: ["swimming", "running"],
          color: "#06A65B",
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NBBLVN-UTAGKL-M6IW3L-YYGHUV-MSI7QZ-EOK675-GWA",
          position: 3,
          assets: 930,
          avatar: "avatar5.png",
          trendline: "up",
          activities: ["running"],
          color: "#6EE7EE",
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NAQ2XB-G5UE45-YXDU2K-M3MFE3-26I3HF-SB563B-JOA",
          position: 4,
          assets: 543,
          avatar: "avatar6.png",
          trendline: "both",
          activities: ["swimming", "running", "cycling"],
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NAQ2XB-G5UE45-YXDU2K-M3MFE3-26I3HF-SB563B-JOA",
          position: 5,
          assets: 102,
          avatar: "avatar7.png",
          trendline: "up",
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NBVCSI-4JCVBZ-LYDXNL-SU76IP-7M5SDZ-MPBCPX-5EY",
          position: 6,
          assets: 2050,
          avatar: "avatar3.png",
          trendline: "up",
          activities: ["running", "cycling"],
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NATZJE-TZTZCG-GRBUYV-QRBEUF-N5LEGD-RSTNF2-GYA",
          position: 7,
          assets: 1905,
          avatar: "avatar4.png",
          trendline: "down",
          activities: ["swimming", "running"],
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NCZMEJ-DHGFCD-MG4C56-SN4VVJ-B7EGJ3-PVDUUE-HPY",
          position: 8,
          assets: 930,
          avatar: "avatar5.png",
          trendline: "up",
          activities: ["running"],
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NBBLVN-UTAGKL-M6IW3L-YYGHUV-MSI7QZ-EOK675-GWA",
          position: 9,
          assets: 543,
          avatar: "avatar6.png",
          trendline: "both",
          activities: ["swimming", "running", "cycling"],
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NAQ2XB-G5UE45-YXDU2K-M3MFE3-26I3HF-SB563B-JOA",
          position: 10,
          assets: 102,
          avatar: "avatar7.png",
          trendline: "up",
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NBVCSI-4JCVBZ-LYDXNL-SU76IP-7M5SDZ-MPBCPX-5EY",
          position: 11,
          assets: 2050,
          avatar: "avatar3.png",
          trendline: "up",
          activities: ["running", "cycling"],
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NATZJE-TZTZCG-GRBUYV-QRBEUF-N5LEGD-RSTNF2-GYA",
          position: 12,
          assets: 1905,
          avatar: "avatar4.png",
          trendline: "down",
          activities: ["swimming", "running"],
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NCZMEJ-DHGFCD-MG4C56-SN4VVJ-B7EGJ3-PVDUUE-HPY",
          position: 13,
          assets: 930,
          avatar: "avatar5.png",
          trendline: "up",
          activities: ["running"],
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NBBLVN-UTAGKL-M6IW3L-YYGHUV-MSI7QZ-EOK675-GWA",
          position: 14,
          assets: 543,
          avatar: "avatar6.png",
          trendline: "both",
          activities: ["swimming", "running", "cycling"],
        },
        {
          type: "leaderboard",
          period: "weekly",
          address: "NAQ2XB-G5UE45-YXDU2K-M3MFE3-26I3HF-SB563B-JOA",
          position: 15,
          assets: 102,
          avatar: "avatar7.png",
          trendline: "up",
        },
      ];
      items = mockedLeaderBoardItems;

      context.commit("setLeaderBoardItems", items);
      return items;
    },
  },
};
