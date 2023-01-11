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

export interface StatisticsModuleState {
  initialized: boolean;
  period: string;
  periodFormat: string;
  position?: number;
  amount?: number;
  data: UserDataAggregateDTO;
}

/**
 *
 */
export type StatisticsModuleContext = ActionContext<
  StatisticsModuleState,
  RootState
>;

export const StatisticsModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "integrations/getIntegrations".
  namespaced: true,
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

  getters: {
    // isLoading: (state: OAuthModuleState): boolean => !state.initialized,
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

  mutations: {
    /**
     *
     */
    setInitialized: (state: StatisticsModuleState, payload: boolean): boolean =>
      (state.initialized = payload),

    /**
     *
     */
    setPeriod: (state: StatisticsModuleState, period: string): string =>
      (state.period = period),

    /**
     *
     */
    setPeriodFormat: (
      state: StatisticsModuleState,
      periodFormat: string
    ): string => (state.periodFormat = periodFormat),

    /**
     *
     */
    setPosition: (state: StatisticsModuleState, position: number): number =>
      (state.position = position),

    /**
     *
     */
    setAmount: (state: StatisticsModuleState, amount: number): number =>
      (state.amount = amount),

    /**
     *
     */
    setData: (
      state: StatisticsModuleState,
      data: UserDataAggregateDTO
    ): UserDataAggregateDTO => Vue.set(state, "data", data),
  },

  actions: {
    /**
     *
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
     *
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
