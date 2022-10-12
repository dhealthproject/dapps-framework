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
    ): Promise<LeaderboardItem[]> {
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

      // Temporary set items for state property until get /leaderboard will provide some real data
      const mockedLeaderboardItems = [
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
      items = mockedLeaderboardItems;

      context.commit("setLeaderboardItems", items);
      return items;
    },
  },
};
