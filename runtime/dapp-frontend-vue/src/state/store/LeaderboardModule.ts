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
 * @interface LeaderboardModuleState
 * @description This interface defines the *state* for the leaderboard module.
 * <br /><br />
 * Following *inputs* apply to the {@link LeaderboardModuleState} interface:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `initialized` | `boolean` | **Required** | Indicates whether leaderboard has been initialized. |
 * | `leaderboardItems` | `LeaderboardEntryDTO[]` | **Required** | The list of leaderboard items as defined in {@link LeaderboardEntryDTO}. |
 * | `userLeaderboardEntry` | `LeaderboardEntryDTO` | **Required** | The specific leaderboard entry that represents user's entry (defined in {@link LeaderboardEntryDTO}). |
 *
 * <br /><br />
 * @example Using the `LeaderboardModuleState` interface
 * ```ts
 * // creating authentication contract inputs
 * const inputs = {
 *   initialized: true,
 *   leaderboardItems: [
 *     {
 *       address: "...",
 *       period: "20221117",
 *       periodFormat: "D",
 *       position: 1,
 *       amount: 0,
 *     }
 *   ],
 *   userLeaderboardEntry: {
 *     address: "...",
 *     period: "20221117",
 *     periodFormat: "D",
 *     position: 1,
 *     amount: 0,
 *   },
 * } as LeaderboardModuleState;
 * ```
 * <br /><br />
 *
 * @since v0.6.3
 */
export interface LeaderboardModuleState {
  initialized: boolean;
  leaderboardItems: LeaderboardEntryDTO[];
  userLeaderboardEntry: LeaderboardEntryDTO;
}

/**
 * @type LeaderboardContext
 * @description This type represents the context of the leaderboard module.
 * <br /><br />
 * This type is to manage leaderboard module's states.
 *
 * @since v0.6.3
 */
export type LeaderboardContext = ActionContext<
  LeaderboardModuleState,
  RootState
>;

/**
 * @constant LeaderboardModule
 * @description The leaderboard vuex module.
 * <br /><br />
 * This constant contains all necessary details for
 * the leaderboard module, including state, getters,
 * mutations and actions.
 *
 * @since v0.6.3
 */
export const LeaderboardModule = {
  /**
   * This store module is namespaced, meaning the
   * module name must be included when calling a
   * mutation, getter or action, i.e. "app/getName".
   *
   * @access public
   * @var {boolean}
   */
  namespaced: true,

  /**
   * Function to create a new state for this module.
   *
   * @access public
   * @returns {LeaderboardModuleState}
   */
  state: (): LeaderboardModuleState => ({
    initialized: false,
    leaderboardItems: [],
    userLeaderboardEntry: {} as LeaderboardEntryDTO,
  }),

  /**
   * The getter functions of this module.
   *
   * @access public
   * @var {object}
   */
  getters: {
    /**
     * Getter to return the list of leaderboard items
     * from the module's current state.
     *
     * @access public
     * @param {LeaderboardModuleState} state
     * @returns {LeaderboardEntryDTO[]}
     */
    getLeaderboardItems: (
      state: LeaderboardModuleState
    ): LeaderboardEntryDTO[] => state.leaderboardItems,

    /**
     * Getter to return the user's leaderboard entry
     * from the module's current state.
     *
     * @access public
     * @param {LeaderboardModuleState} state
     * @returns {LeaderboardEntryDTO}
     */
    getUserLeaderboardEntry: (
      state: LeaderboardModuleState
    ): LeaderboardEntryDTO => state.userLeaderboardEntry,
  },

  /**
   * The mutation functions of this module instance.
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
     * @param {LeaderboardModuleState} state
     * @param {boolean} payload
     * @returns {boolean}
     */
    setInitialized: (
      state: LeaderboardModuleState,
      payload: boolean
    ): boolean => (state.initialized = payload),

    /**
     * Mutation function to set the list of items
     * to current module state.
     *
     * @access public
     * @param {LeaderboardModuleState} state
     * @param {LeaderboardEntryDTO[]} leaderboardItems
     * @returns {LeaderboardEntryDTO[]}
     */
    setLeaderboardItems: (
      state: LeaderboardModuleState,
      leaderboardItems: LeaderboardEntryDTO[]
    ): any[] => Vue.set(state, "leaderboardItems", leaderboardItems),

    /**
     * Mutation function to insert a new leaderboard item
     * into the current module state's list.
     *
     * @access public
     * @param {LeaderboardModuleState} state
     * @param {LeaderboardEntryDTO} item
     * @returns {number}
     */
    addLeaderboardItem: (
      state: LeaderboardModuleState,
      item: LeaderboardEntryDTO
    ): number => state.leaderboardItems.push(item),

    /**
     * Mutation function to set the user item
     * to current module state.
     *
     * @access public
     * @param {LeaderboardModuleState} state
     * @param {LeaderboardEntryDTO} leaderboardEntry
     * @returns {LeaderboardEntryDTO}
     */
    setUserLeaderboardEntry: (
      state: LeaderboardModuleState,
      leaderboardEntry: LeaderboardEntryDTO
    ): LeaderboardEntryDTO =>
      Vue.set(state, "userLeaderboardEntry", leaderboardEntry),
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
     * @param {LeaderboardContext} context
     * @returns {Promise<boolean>}
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
     * Action method to fetch the latest leaderboard items
     * and update the leaderboard module's current state.
     *
     * @access public
     * @async
     * @param {LeaderboardContext} context
     * @param {{ periodFormat: string}} payload
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
     * Action method to fetch the latest leaderboard user item
     * and update the leaderboard module's current state.
     *
     * @access public
     * @async
     * @param {LeaderboardContext} context
     * @param {{ address: string; periodFormat: string }} payload
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

        context.commit("setUserLeaderboardEntry", entry);
      } catch (err) {
        console.log("fetchLeaderboard", err);
      }
    },
  },
};
