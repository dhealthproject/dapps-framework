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
import { AccessTokenDTO, AuthService } from "@/services/AuthService";
import { AwaitLock } from "../AwaitLock";
import { User } from "../../models/User";

/**
 * @todo missing interface documentation
 */
export interface AuthState {
  initialized: boolean;
  isAuthenticated: boolean;
  authChallenge?: string;
  accessToken?: string;
  refreshToken?: string;
  currentUserAddress?: string;
  isProviderIntegrated?: boolean;
  userRefCode?: string;
  authRegistry?: string;
}

/**
 * @todo missing interface documentation
 */
export type AuthContext = ActionContext<AuthState, RootState>;

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 * @todo missing interface documentation
 */
export const AuthModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "app/getName".
  namespaced: true,
  state: (): AuthState => ({
    initialized: false,
    isAuthenticated: false,
    authChallenge: undefined,
    accessToken: undefined,
    refreshToken: undefined,
    currentUserAddress: undefined,
    userRefCode: undefined,
    authRegistry: undefined,
  }),

  getters: {
    isLoading: (state: AuthState): boolean => !state.initialized,
    isAuthenticated: (state: AuthState): boolean => state.isAuthenticated,
    getChallenge: (state: AuthState): string | undefined => state.authChallenge,
    getAccessToken: (state: AuthState): string | undefined => state.accessToken,
    getRefreshToken: (state: AuthState): string | undefined =>
      state.refreshToken,
    getCurrentUserAddress: (state: AuthState): string | undefined =>
      state.currentUserAddress,
    getRefCode: (state: AuthState): string | undefined => state.userRefCode,
    getAuthRegistry: (state: AuthState): string | undefined =>
      state.authRegistry,
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
    setAuthenticated: (state: AuthState, payload: boolean): boolean =>
      (state.isAuthenticated = payload),

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

    /**
     *
     */
    setRefreshToken: (state: AuthState, refreshToken: string): string =>
      (state.refreshToken = refreshToken),

    /**
     *
     */
    setCurrentUserAddress: (state: AuthState, userAddress: string): string =>
      (state.currentUserAddress = userAddress),

    setIsProviderIntegrated: (state: AuthState, providerState: boolean) =>
      (state.isProviderIntegrated = providerState),

    setRefCode: (state: AuthState, refCode: string) =>
      (state.userRefCode = refCode),

    setAuthRegistry: (state: AuthState, registry: string) =>
      (state.authRegistry = registry),
  },

  actions: {
    /**
     *
     */
    async initialize(context: AuthContext): Promise<boolean> {
      const callback = async () => {
        // fetch a user profile (only works if signed cookie is present)
        const profile: User | null = await context.dispatch("fetchProfile");

        // fetch a challenge to permit sign-in if necessary
        if (profile === null) {
          await context.dispatch("fetchChallenge");
        }

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
    async fetchChallenge(context: AuthContext): Promise<string> {
      const handler = new AuthService();
      const challenge = await handler.getChallenge();

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
        const refCode: string = context.getters["getRefCode"];
        const registry: string = context.getters["getAuthRegistry"];

        // try authenticating the user and requesting an access token
        // this will only succeed provided that the end-user attached
        // the authentication challenge in a transfer transaction
        const response: AccessTokenDTO = await handler.login(
          authChallenge,
          registry,
          refCode ? refCode : undefined
        );

        try {
          // remove refCode after it's got used
          localStorage.removeItem("refCode");
        } catch (err) {
          console.log("Error in removing refCode, due to cookies blocked");
        }

        context.commit("setAuthenticated", true);
        context.commit("setAccessToken", response.accessToken);
        context.commit("setRefreshToken", response.refreshToken);
        return response;
      } catch (e) {
        // because dHealth Network data storage is asynchronous, the
        // backend API returns a HTTP401-Unauthorized *until* it can
        // find the authentication challenge inside a transaction.
        context.commit("setAuthenticated", false);
        return null;
      }
    },

    /**
     *
     */
    async fetchProfile(context: AuthContext): Promise<User | null> {
      try {
        const handler = new AuthService();
        const profile: User = await handler.getProfile();

        context.commit("setAuthenticated", true);
        context.commit("setRefCode", profile.referralCode);
        context.commit("setCurrentUserAddress", profile.address);
        context.commit("oauth/setIntegrations", profile.integrations, {
          root: true,
        });
        return profile;
      } catch (e) {
        context.commit("setAuthenticated", false);
        return null;
      }
    },

    /**
     *
     */
    async logoutProfile(context: AuthContext): Promise<boolean> {
      const handler = new AuthService();
      await handler.logout();

      // fetch new challenge value
      // so user don't have to reload the page to login again
      await context.dispatch("fetchChallenge");

      context.commit("setAuthenticated", false);
      context.commit("setAccessToken", undefined);
      context.commit("setRefreshToken", undefined);
      context.commit("setRefCode", undefined);
      context.commit("setCurrentUserAddress", undefined);
      return true;
    },
  },
};
