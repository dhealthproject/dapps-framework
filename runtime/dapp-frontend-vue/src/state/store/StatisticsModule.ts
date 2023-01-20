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
import {
  UserDataAggregateDTO,
  UserStatisticsDTO,
} from "@/models/UserStatisticsDTO";
import { StatisticsService } from "@/services/StatisticsService";

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 * @interface StatisticsModuleState
 * @description This interface defines the *state* for the auth module.
 * <br /><br />
 * Following *inputs* apply to the {@link StatisticsModuleState} interface:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `initialized` | `boolean` | **Required** | Indicates whether module state has been initialized. |
 * | `period` | `string` | **Required** | Indicates the current period of the statistics in ISO format e.g. `"20230120"`, `"202301"`. |
 * | `periodFormat` | `string` | **Required** | Indicates the period format of the statistics e.g. `"D"` for daily, `"M"` for monthly. |
 * | `position` | `number` | *Optional* | Indicates the current position of this user on the leaderboard. |
 * | `amount` | `number` | *Optional* | Indicates the total amount of reward user has received. |
 * | `data` | `UserDataAggregateDTO` | **Required** | The user's data from the aggregation provider e.g. Strava. Defined in {@link UserDataAggregateDTO}. |
 *
 * <br /><br />
 * @example Using the `OAuthModuleState` interface
 * ```ts
 * // creating OAuthModuleState inputs
 * const inputs = {
 *   initialized: true,
 *   period: "20230120",
 *   periodFormat: "D",
 *   position: 2,
 *   amount: 2000000,
 *   data: {
 *     totalPracticedMinutes: 120;
 *     totalEarned: 2000000;
 *     topActivities: "run";
 *     totalReferral: 1;
 *     levelReferral: 1;
 *   }
 * } as AuthState;
 * ```
 * <br /><br />
 *
 * @since v0.6.3
 */
export interface StatisticsModuleState {
  initialized: boolean;
  period: string;
  periodFormat: string;
  position?: number;
  amount?: number;
  data: UserDataAggregateDTO;
}

/**
 * @type StatisticsModuleContext
 * @description This type represents the context of the statistics module.
 * <br /><br />
 * This type is to manage statistics module's states.
 *
 * @since v0.6.3
 */
export type StatisticsModuleContext = ActionContext<
  StatisticsModuleState,
  RootState
>;

/**
 * @constant StatisticsModule
 * @description The statistics vuex module.
 * <br /><br />
 * This constant contains all necessary details for
 * the statistics module, including state, getters,
 * mutations and actions.
 *
 * @since v0.6.3
 */
export const StatisticsModule = {
  /**
   * This store module is namespaced, meaning the
   * module name must be included when calling a
   * mutation, getter or action, i.e. "integrations/getIntegrations".
   *
   * @access public
   * @var {boolean}
   */
  namespaced: true,

  /**
   * Function to create a new state for this module.
   *
   * @access public
   * @returns {StatisticsModuleState}
   */
  state: (): StatisticsModuleState => ({
    initialized: false,
    period: "",
    periodFormat: "W",
    position: 0,
    amount: 0,
    data: {
      totalEarned: 0,
      totalPracticedMinutes: 0,
    },
  }),

  /**
   * The getter functions of this module instance.
   *
   * @access public
   * @var {object}
   */
  getters: {
    // isLoading: (state: OAuthModuleState): boolean => !state.initialized,

    /**
     * Getter to return this module state.
     *
     * @access public
     * @param {StatisticsModuleState} state
     * @returns {UserStatisticsDTO | undefined}
     */
    getUserStatistics: (
      state: StatisticsModuleState
    ): UserStatisticsDTO | undefined =>
      ({
        period: state.period,
        periodFormat: state.periodFormat,
        position: state.position,
        amount: state.amount,
        data: {
          ...state.data,
        },
      } as UserStatisticsDTO),
  },

  /**
   * The mutation functions of this module.
   *
   * @access public
   * @var {object}
   */
  mutations: {
    /**
     * Mutation function to set the initialization status
     * to current module state.
     *
     * @param {StatisticsModuleState} state
     * @param {boolean} payload
     * @returns {boolean}
     */
    setInitialized: (state: StatisticsModuleState, payload: boolean): boolean =>
      (state.initialized = payload),

    /**
     * Mutation function to set the period
     * to current module state.
     *
     * @access public
     * @param {StatisticsModuleState} state
     * @param {string} period
     * @returns {string}
     */
    setPeriod: (state: StatisticsModuleState, period: string): string =>
      (state.period = period),

    /**
     * Mutation function to set the period format
     * to current module state.
     *
     * @access public
     * @param {StatisticsModuleState} state
     * @param {string} periodFormat
     * @returns {string}
     */
    setPeriodFormat: (
      state: StatisticsModuleState,
      periodFormat: string
    ): string => (state.periodFormat = periodFormat),

    /**
     * Mutation function to set the user position
     * to current module state.
     *
     * @access public
     * @param {StatisticsModuleState} state
     * @param {number} position
     * @returns {number}
     */
    setPosition: (state: StatisticsModuleState, position: number): number =>
      (state.position = position),

    /**
     * Mutation function to set the total reward amount
     * to current module state.
     *
     * @access public
     * @param {StatisticsModuleState} state
     * @param {number} amount
     * @returns {number}
     */
    setAmount: (state: StatisticsModuleState, amount: number): number =>
      (state.amount = amount),

    /**
     * Mutation function to set the statistics data
     * (as defined in {@link UserDataAggregateDTO})
     * to current module state.
     *
     * @access public
     * @param {StatisticsModuleState} state
     * @param {UserDataAggregateDTO} data
     * @returns {UserDataAggregateDTO}
     */
    setData: (
      state: StatisticsModuleState,
      data: UserDataAggregateDTO
    ): UserDataAggregateDTO => Vue.set(state, "data", data),
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
     * @param {StatisticsModuleContext} context
     * @returns {Promise<boolean>}
     */
    async initialize(context: StatisticsModuleContext): Promise<boolean> {
      const callback = () => {
        // initialization of this module is empty
        context.commit("setInitialized", true);
      };

      // acquire async lock until initialized
      await Lock.initialize(callback, context);
      return true;
    },

    /**
     * Action method to fetch the user statistics data and
     * update the module's current state.
     *
     * @access public
     * @async
     * @param {StatisticsModuleContext} context
     * @param {string} address
     * @returns {Promise<UserStatisticsDTO | undefined>}
     */
    async fetchStatistics(
      context: StatisticsModuleContext,
      address: string
    ): Promise<UserStatisticsDTO | undefined> {
      const service = new StatisticsService();
      const statistics: UserStatisticsDTO[] = await service.getUserStatistics(
        address
      );

      if (!statistics || !statistics.length) {
        return undefined;
      }

      context.commit("setPeriod", statistics[0].period);
      context.commit("setPeriodFormat", statistics[0].periodFormat);
      context.commit("setPosition", statistics[0].position);
      context.commit("setAmount", statistics[0].amount);
      context.commit("setData", {
        ...statistics[0].data,
      } as UserDataAggregateDTO);
      return statistics[0];
    },
  },
};
