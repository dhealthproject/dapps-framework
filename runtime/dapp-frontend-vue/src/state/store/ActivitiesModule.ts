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
import { ActivityEntryDTO } from "../../models/ActivityDTO";
import { ActivitiesService } from "../../services/ActivityService";

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 * @todo missing interface documentation
 */
export interface ActivitiesModuleState {
  initialized: boolean;
  activitiesItems: ActivityEntryDTO[];
}

/**
 * @todo missing interface documentation
 */
export type ActivitiesContext = ActionContext<ActivitiesModuleState, RootState>;

/**
 * @todo missing interface documentation
 */
export const ActivitiesModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "app/getName".
  namespaced: true,
  state: (): ActivitiesModuleState => ({
    initialized: false,
    activitiesItems: [],
  }),

  getters: {
    getActivityItems: (state: ActivitiesModuleState): ActivityEntryDTO[] =>
      state.activitiesItems,
  },

  mutations: {
    /**
     *
     */
    setInitialized: (state: ActivitiesModuleState, payload: boolean): boolean =>
      (state.initialized = payload),

    /**
     *
     */
    setActivities: (
      state: ActivitiesModuleState,
      payload: ActivityEntryDTO[]
    ): ActivityEntryDTO[] => (state.activitiesItems = payload),
  },

  actions: {
    /**
     *
     */
    async initialize(context: ActivitiesContext): Promise<boolean> {
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
    async fetchActivities(
      context: ActivitiesContext,
      address: string
    ): Promise<void> {
      try {
        const service = new ActivitiesService();
        const items = await service.getActivities(address);

        context.commit("setActivities", items);
      } catch (err) {
        console.log("fetchActivities", err);
      }
    },
  },
};
