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
import { RootState } from ".";
import { AccessTokenDTO, AuthService } from "@/services/AuthService";
import { AwaitLock } from "../AwaitLock";

/**
 *
 */
export interface AuthState {
  initialized: boolean;
  authChallenge?: string;
  accessToken?: string;
  refreshToken?: string;
}

/**
 *
 */
export type AuthContext = ActionContext<AuthState, RootState>;

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 *
 */
export const AuthModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "app/getName".
  namespaced: true,
  state: (): AuthState => ({
    initialized: false,
    authChallenge: undefined,
    accessToken: undefined,
    refreshToken: undefined,
  }),

  getters: {
    isLoading: (state: AuthState): boolean => !state.initialized,
    getChallenge: (state: AuthState): string | undefined => state.authChallenge,
    getAccessToken: (state: AuthState): string | undefined => state.accessToken,
    getRefreshToken: (state: AuthState): string | undefined =>
      state.refreshToken,
  },

  mutations: {
    /**
     *
     */
    setInitialized: (state: AuthState, payload: boolean): boolean =>
      (state.initialized = payload),

    /**
     *
     */
    setChallenge: (state: AuthState, challenge: string): string =>
      (state.authChallenge = challenge),

    /**
     *
     */
    setAccessToken: (state: AuthState, accessToken: string): string =>
      (state.accessToken = accessToken),
  },

  actions: {
    /**
     *
     */
    async initialize(context: AuthContext): Promise<boolean> {
      const callback = async () => {
        await context.dispatch("fetchChallenge");
        context.commit("setInitialized", true);
      };

      // aquire async lock until initialized
      await Lock.initialize(callback, context);
      return true;
    },

    /**
     *
     */
    async fetchChallenge(context: AuthContext): Promise<string> {
      const handler = new AuthService();
      const challenge = await handler.getAuthChallenge();

      context.commit("setChallenge", challenge);
      return challenge;
    },

    /**
     *
     */
    async fetchAccessToken(
      context: AuthContext
    ): Promise<AccessTokenDTO | null> {
      try {
        const handler = new AuthService();
        const authChallenge: string = context.getters["getChallenge"];

        // try authenticating the user and requesting an access token
        // this will only succeed provided that the end-user attached
        // the authentication challenge in a transfer transaction
        const response: AccessTokenDTO = await handler.login(authChallenge);

        context.commit("setAccessToken", response.accessToken);
        return response;
      } catch (e) {
        // because dHealth Network data storage is asynchronous, the
        // backend API returns a HTTP401-Unauthorized *until* it can
        // find the authentication challenge inside a transaction.
        return null;
      }
    },
  },
};
