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
import { IntegrationsService } from "../../services/IntegrationsService";

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 * @todo missing interface documentation
 */
export interface OAuthParameters {
  code: string;
  state: string;
  scope: string;
}
export interface OAuthModuleState {
  initialized: boolean;
  integrations: string[];
  isIntegrating: boolean;
  oauthParameters: OAuthParameters;
}

/**
 * @todo missing interface documentation
 */
export type OAuthModuleContext = ActionContext<OAuthModuleState, RootState>;

/**
 * @todo missing interface documentation
 */
export const OAuthModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "integrations/getIntegrations".
  namespaced: true,
  state: (): OAuthModuleState => ({
    initialized: false,
    integrations: [],
    isIntegrating: false,
    oauthParameters: {} as OAuthParameters,
  }),

  getters: {
    isLoading: (state: OAuthModuleState): boolean => !state.initialized,
    isIntegrating: (state: OAuthModuleState): boolean => state.isIntegrating,
    getIntegrations: (state: OAuthModuleState): string[] => state.integrations,
    getParameters: (state: OAuthModuleState): OAuthParameters =>
      state.oauthParameters,
  },

  mutations: {
    /**
     *
     */
    setInitialized: (state: OAuthModuleState, payload: boolean): boolean =>
      (state.initialized = payload),

    /**
     *
     */
    setIntegrations: (state: OAuthModuleState, payload: string[]): string[] =>
      (state.integrations = payload),

    /**
     *
     */
    setIntegrating: (state: OAuthModuleState, payload: boolean): boolean =>
      (state.isIntegrating = payload),

    /**
     *
     */
    setParameters: (
      state: OAuthModuleState,
      payload: OAuthParameters
    ): OAuthParameters => (state.oauthParameters = payload),
  },

  actions: {
    /**
     *
     */
    async initialize(context: OAuthModuleContext): Promise<boolean> {
      const callback = async () => {
        // loads integrations for current user
        await context.dispatch("fetchIntegrations");

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
    async fetchIntegrations(context: OAuthModuleContext): Promise<string[]> {
      // reads from localStorage
      const fromStorage = localStorage.getItem("integrations");
      if (null === fromStorage) {
        return [];
      }

      // parse content and mutate state
      const integrations = JSON.parse(fromStorage);
      context.commit("setIntegrations", integrations);
      return integrations;
    },

    /**
     *
     */
    authorize(context: OAuthModuleContext, address: string): void {
      if (!address || !address.length) {
        throw new Error(`Invalid user address, must not be empty.`);
      }

      context.commit("setIntegrating", true);
      window.location.href =
        process.env.VUE_APP_BACKEND_URL +
        `/oauth/strava/authorize?&dhealthAddress=${address}`;
    },

    /**
     *
     */
    async callback(
      context: OAuthModuleContext,
      address: string
    ): Promise<void> {
      if (!address || !address.length) {
        throw new Error(`Invalid user address, must not be empty.`);
      }

      const service = new IntegrationsService();
      const parameters = context.state.oauthParameters;
      try {
        // strava is the only provider currently
        await service.callback("strava", parameters);
        console.log("Provider linked successfully");
      } catch (err) {
        console.log("[store/OAuthModule] Error in callback action: ", err);
      }
    },

    /**
     *
     */
    async revoke(context: OAuthModuleContext, provider: string): Promise<void> {
      const service = new IntegrationsService();
      try {
        // strava is the only provider currently
        await service.revoke(provider);
        await context.dispatch("auth/fetchProfile", "", { root: true });
      } catch (e) {
        console.log("oauth/revoke", e);
        throw e;
      }
    },
  },
};
