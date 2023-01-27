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
import { RewardsService } from "../../services/RewardsService";
import { AssetEntry } from "@/models/AssetDTO";

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

export interface AssetsModuleState {
  initialized: boolean;
  userAssets: AssetEntry[];
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
    userAssets: [],
  }),

  getters: {
    isLoading: (state: AssetsModuleState): boolean => !state.initialized,
    getAssets: (state: AssetsModuleState): AssetEntry[] => state.userAssets,
  },

  mutations: {
    /**
     *
     */
    setInitialized: (state: AssetsModuleState, payload: boolean): boolean =>
      (state.initialized = payload),

    setAssets: (state: AssetsModuleState, payload: AssetEntry[]) =>
      (state.userAssets = payload),
  },

  actions: {
    /**
     *
     */
    async fetchRewards(
      context: AssetsModuleContext,
      address: string
    ): Promise<AssetEntry[] | undefined> {
      const service = new RewardsService();
      const response = await service.getAssetsByAddress(address);
      const assets = response.data;

      console.log({ response });

      context.commit("setAssets", assets);

      return assets;
    },
  },
};
