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
import { IntegrationsService } from "@/services/IntegrationsService";
import { AwaitLock } from "../AwaitLock";

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 *
 */
export interface IntegrationsState {
  integrations: string[];
}

/**
 *
 */
export type IntegrationsContext = ActionContext<IntegrationsState, RootState>;

export const IntegrationsModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "integrations/getIntegrations".
  namespaced: true,
  state: (): IntegrationsState => ({
    integrations: [],
  }),

  getters: {
    /**
     *
     */
    getIntegrations: (state: IntegrationsState): string[] => {
      const integrations = localStorage.getItem("integrations");
      let availableIntegrations: any;

      if (integrations) {
        availableIntegrations = JSON.parse(integrations);
      }

      return state.integrations.length
        ? state.integrations
        : availableIntegrations;
    },
  },

  mutations: {
    /**
     *
     */
    setIntegrations: (state: IntegrationsState, payload: string): string[] => {
      const alreadyIntegrated = state.integrations.find(
        (integration) => integration === payload
      );

      if (!alreadyIntegrated) {
        state.integrations = [...state.integrations, payload];
        localStorage.setItem(
          "integrations",
          JSON.stringify(state.integrations)
        );
      }
      return state.integrations;
    },

    /**
     *
     */
    assignIntegrations(state: IntegrationsState, payload: string[]) {
      state.integrations = payload;
    },
  },

  actions: {
    /**
     *
     */
    async linkStrava(context: IntegrationsContext, payload: any) {
      const handler = new IntegrationsService();
      context.commit("setIntegrations", "strava");
      await handler.linkStrava(payload);
    },
  },
};
