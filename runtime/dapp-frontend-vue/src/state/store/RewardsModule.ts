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
import { AssetEntry, AssetDTO } from "@/models/AssetDTO";

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

export interface AssetsModuleState {
  initialized: boolean;
  userMedals: AssetEntry[];
}

/**
 *
 */
export type AssetsModuleContext = ActionContext<AssetsModuleState, RootState>;

export const AssetsModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "integrations/getIntegrations".
  namespaced: true,
  state: (): AssetsModuleState => ({
    initialized: false,
    userMedals: [],
  }),

  getters: {
    // isLoading: (state: OAuthModuleState): boolean => !state.initialized,
    //     getUserStatistics: (
    //       state: StatisticsModuleState
    //     ): UserStatisticsDTO | undefined =>
    //       ({
    //         period: state.period,
    //         periodFormat: state.periodFormat,
    //         position: state.position,
    //         amount: state.amount,
    //         data: {
    //           ...state.data,
    //         },
    //       } as UserStatisticsDTO),
  },

  mutations: {
    /**
     *
     */
    setInitialized: (state: AssetsModuleState, payload: boolean): boolean =>
      (state.initialized = payload),
  },

  actions: {
    /**
     *
     */
    // async fetchStatistics(
    //   context: StatisticsModuleContext,
    //   address: string
    // ): Promise<UserStatisticsDTO | undefined> {
    //   const service = new StatisticsService();
    //   const statistics: UserStatisticsDTO[] = await service.getUserStatistics(
    //     address
    //   );
    //   if (!statistics || !statistics.length) {
    //     return undefined;
    //   }
    //   context.commit("setPeriod", statistics[0].period);
    //   context.commit("setPeriodFormat", statistics[0].periodFormat);
    //   context.commit("setPosition", statistics[0].position);
    //   context.commit("setAmount", statistics[0].amount);
    //   context.commit("setData", {
    //     ...statistics[0].data,
    //   } as UserDataAggregateDTO);
    //   return statistics[0];
    // },
  },
};
