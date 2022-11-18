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
import Vue from "vue";
import { ActionContext } from "vuex";

// internal dependencies
import { RootState } from "./Store";
import { AwaitLock } from "../AwaitLock";
import { LeaderboardEntryDTO } from "@/models/LeaderboardDTO";
import { LeaderboardService } from "../../services/LeaderboardService";

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 * @todo missing interface documentation
 */
export interface LeaderboardModuleState {
  initialized: boolean;
  leaderboardItems: LeaderboardEntryDTO[];
  userLeaderboardEntry: LeaderboardEntryDTO;
}

/**
 * @todo missing interface documentation
 */
export type LeaderboardContext = ActionContext<
  LeaderboardModuleState,
  RootState
>;

/**
 * @todo missing interface documentation
 */
export const LeaderboardModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "app/getName".
  namespaced: true,
  state: (): LeaderboardModuleState => ({
    initialized: false,
    leaderboardItems: [],
    userLeaderboardEntry: {} as LeaderboardEntryDTO,
  }),

  getters: {
    getLeaderboardItems: (
      state: LeaderboardModuleState
    ): LeaderboardEntryDTO[] => state.leaderboardItems,

    getUserLeaderboardEntry: (
      state: LeaderboardModuleState
    ): LeaderboardEntryDTO => state.userLeaderboardEntry,
  },

  mutations: {
    /**
     *
     */
    setInitialized: (
      state: LeaderboardModuleState,
      payload: boolean
    ): boolean => (state.initialized = payload),

    /**
     *
     */
    setLeaderboardItems: (
      state: LeaderboardModuleState,
      leaderboardItems: LeaderboardEntryDTO[]
    ): any[] => Vue.set(state, "leaderboardItems", leaderboardItems),

    /**
     *
     */
    addLeaderboardItem: (
      state: LeaderboardModuleState,
      item: LeaderboardEntryDTO
    ) => state.leaderboardItems.push(item),

    /**
     *
     */
    setUserLeaderboardEntry: (
      state: LeaderboardModuleState,
      leaderboardEntry: LeaderboardEntryDTO
    ): LeaderboardEntryDTO =>
      Vue.set(state, "userLeaderboardEntry", leaderboardEntry),
  },

  actions: {
    /**
     *
     */
    async initialize(context: LeaderboardContext): Promise<boolean> {
      const callback = () => {
        // initialization is done after fetch
        context.commit("setInitialized", true);
      };

      // acquire async lock until initialized
      await Lock.initialize(callback, context);
      return true;
    },

    /**
     *
     */
    async fetchLeaderboard(
      context: LeaderboardContext,
      payload: { periodFormat: string }
    ): Promise<void> {
      try {
        const handler = new LeaderboardService();
        const items: LeaderboardEntryDTO[] = await handler.getLeaderboard(
          payload.periodFormat
        );

        context.commit("setLeaderboardItems", items);
      } catch (err) {
        console.log("fetchLeaderboard", err);
      }
    },

    /**
     *
     */
    async fetchUserLeaderboardEntry(
      context: LeaderboardContext,
      payload: { address: string; periodFormat: string }
    ): Promise<void> {
      try {
        const handler = new LeaderboardService();
        const entry: LeaderboardEntryDTO = await handler.getUserLeaderboard(
          payload.address,
          payload.periodFormat
        );

        console.log("Store gets: ", entry);
        context.commit("setUserLeaderboardEntry", entry);
      } catch (err) {
        console.log("fetchLeaderboard", err);
      }
    },
  },
};
