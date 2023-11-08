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
 * @interface AuthState
 * @description This interface defines the *state* for the auth module.
 * <br /><br />
 * Following *inputs* apply to the {@link AuthState} interface:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `initialized` | `boolean` | **Required** | Indicates whether module state has been initialized. |
 * | `isAuthenticated` | `boolean` | **Required** | Indicates whether module state has been authenticated. |
 * | `authChallenge` | `string` | *Optional* | The current challenge used for authentication. |
 * | `accessToken` | `string` | *Optional* | The access token used for authentication. |
 * | `refreshToken` | `string` | *Optional* | The refresh token used for authentication. |
 * | `currentUserAddress` | `string` | *Optional* | The current user address that is used for authentication. |
 * | `isProviderIntegrated` | `boolean` | *Optional* | Indicates whether an oauth provider was integrated. |
 * | `userRefCode` | `string` | *Optional* | The user referral code that is used for authentication. |
 * | `authRegistry` | `string` | *Optional* | The authentication registry that is used for authentication. |
 *
 * <br /><br />
 * @example Using the `OAuthModuleState` interface
 * ```ts
 * // creating OAuthModuleState inputs
 * const inputs = {
 *   initialized: true,
 *   isAuthenticated: true,
 *   authChallenge: "cvx17l1r",
 *   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MDk4M2Q2OTJmNjQ4MTg1ZmViZTZkNmZhNjA3NjMwYWU2ODY0OWY3ZTZmYzQ1Yjk0NjgwMDk2YzA2ZTVmYWI3IiwiYWRkcmVzcyI6Ik5CUFFMRktGSkNHSEZTQTJMTlBIVFJaV0dBU0xRQVlXSFdSVlNKQSIsImlhdCI6MTY3NDIwNzgxNywiZXhwIjoxNjc0MjExNDE3fQ.eLn_v_4Ivw97uWQVltSg9NhJfHw9RcP_fmombr6cuQI",
 *   refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MDk4M2Q2OTJmNjQ4MTg1ZmViZTZkNmZhNjA3NjMwYWU2ODY0OWY3ZTZmYzQ1Yjk0NjgwMDk2YzA2ZTVmYWI3IiwiYWRkcmVzcyI6Ik5CUFFMRktGSkNHSEZTQTJMTlBIVFJaV0dBU0xRQVlXSFdSVlNKQSIsImlhdCI6MTY3NDIwNzgxNywiZXhwIjoxNzA1NzY1NDE3fQ.7FElWwuRGxJFpeCPDBgPpXefsdp7hkiEqTwYHv-EiuQ",
 *   currentUserAddress: "NBPQLFKFJCGHFSA2LNPHTRZWGASLQAYWHWRVSJA",
 *   isProviderIntegrated: true,
 *   userRefCode: "JOINFIT-o7uv8yvk",
 *   authRegistry: "NBPQLFKFJCGHFSA2LNPHTRZWGASLQAYWHWRVSJA"
 * } as AuthState;
 * ```
 * <br /><br />
 *
 * @since v0.6.3
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
 * @type AuthContext
 * @description This type represents the context of the auth module.
 * <br /><br />
 * This type is to manage auth module's states.
 *
 * @since v0.6.3
 */
export type AuthContext = ActionContext<AuthState, RootState>;

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

/**
 * @constant AuthModule
 * @description The auth vuex module.
 * <br /><br />
 * This constant contains all necessary details for
 * the auth module, including state, getters,
 * mutations and actions.
 *
 * @since v0.6.3
 */
export const AuthModule = {
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
   * @returns {OAuthModuleState}
   */
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

  /**
   * The getter functions of this module instance.
   *
   * @access public
   * @var {object}
   */
  getters: {
    /**
     * Getter to return the initialization status from the module's state.
     *
     * @access public
     * @param {OAuthModuleState} state
     * @returns {boolean}
     */
    isLoading: (state: AuthState): boolean => !state.initialized,

    /**
     * Getter to return the authentication status from the module's state.
     *
     * @access public
     * @param {AuthState} state
     * @returns {boolean}
     */
    isAuthenticated: (state: AuthState): boolean => state.isAuthenticated,

    /**
     * Getter to return the challenge from the module's state.
     *
     * @access public
     * @param {AuthState} state
     * @returns {string | undefined}
     */
    getChallenge: (state: AuthState): string | undefined => state.authChallenge,

    /**
     * Getter to return the access token from the module's state.
     *
     * @access public
     * @param {AuthState} state
     * @returns {string | undefined}
     */
    getAccessToken: (state: AuthState): string | undefined => state.accessToken,

    /**
     * Getter to return the refresh token from the module's state.
     *
     * @access public
     * @param {AuthState} state
     * @returns {string | undefined}
     */
    getRefreshToken: (state: AuthState): string | undefined =>
      state.refreshToken,

    /**
     * Getter to return the current user address from the module's state.
     *
     * @access public
     * @param {AuthState} state
     * @returns {string | undefined}
     */
    getCurrentUserAddress: (state: AuthState): string | undefined =>
      state.currentUserAddress,

    /**
     * Getter to return the user's referral code from the module's state.
     *
     * @access public
     * @param {AuthState} state
     * @returns {string | undefined}
     */
    getRefCode: (state: AuthState): string | undefined => state.userRefCode,
    getAuthRegistry: (state: AuthState): string | undefined =>
      state.authRegistry,
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
     * @access public
     * @param {AuthState} state
     * @param {boolean} payload
     * @returns {boolean}
     */
    setInitialized: (state: AuthState, payload: boolean): boolean =>
      (state.initialized = payload),

    /**
     * Mutation function to set the authentication status
     * to current module state.
     *
     * @access public
     * @param {AuthState} state
     * @param {boolean} payload
     * @returns {boolean}
     */
    setAuthenticated: (state: AuthState, payload: boolean): boolean =>
      (state.isAuthenticated = payload),

    /**
     * Mutation function to set the challenge value
     * to current module state.
     *
     * @access public
     * @param {AuthState} state
     * @param {string} challenge
     * @returns {string}
     */
    setChallenge: (state: AuthState, challenge: string): string =>
      (state.authChallenge = challenge),

    /**
     * Mutation function to set the access token value
     * to current module state.
     *
     * @access public
     * @param {AuthState} state
     * @param {string} accessToken
     * @returns {string}
     */
    setAccessToken: (state: AuthState, accessToken: string): string =>
      (state.accessToken = accessToken),

    /**
     * Mutation function to set the refresh token value
     * to current module state.
     *
     * @access public
     * @param {AuthState} state
     * @param {string} refreshToken
     * @returns {string}
     */
    setRefreshToken: (state: AuthState, refreshToken: string): string =>
      (state.refreshToken = refreshToken),

    /**
     * Mutation function to set the current user address
     * to current module state.
     *
     * @access public
     * @param {AuthState} state
     * @param {string} userAddress
     * @returns {string}
     */
    setCurrentUserAddress: (state: AuthState, userAddress: string): string =>
      (state.currentUserAddress = userAddress),

    /**
     * Mutation function to set the provider integration status
     * to current module state.
     *
     * @access public
     * @param {AuthState} state
     * @param {boolean} providerState
     * @returns {boolean}
     */
    setIsProviderIntegrated: (state: AuthState, providerState: boolean) =>
      (state.isProviderIntegrated = providerState),

    /**
     * Mutation function to set the user's referral code
     * to current module state.
     *
     * @access public
     * @param {AuthState} state
     * @param {string} refCode
     * @returns {string}
     */
    setRefCode: (state: AuthState, refCode: string) =>
      (state.userRefCode = refCode),

    /**
     * Mutation function to set the authentication registry address
     * to current module state.
     *
     * @access public
     * @param {AuthState} state
     * @param {string} registry
     * @returns {string}
     */
    setAuthRegistry: (state: AuthState, registry: string) =>
      (state.authRegistry = registry),
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
     * @param {AuthContext} context
     * @returns {Promise<boolean>}
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
     * Action method to fetch the challenge value and
     * update the module's current state.
     *
     * @access public
     * @async
     * @param {AuthContext} context
     * @returns {Promise<string>}
     */
    async fetchChallenge(context: AuthContext): Promise<string> {
      const handler = new AuthService();
      const challenge = await handler.getChallenge();

      context.commit("setChallenge", challenge);
      return challenge;
    },

    /**
     * Action method to fetch the access token and
     * update the module's current state.
     *
     * @access public
     * @async
     * @param {AuthContext} context
     * @returns {Promise<AccessTokenDTO | null>}
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

        // remove refCode after it's got used
        localStorage.removeItem("refCode");

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
     * Action method to fetch the profile (as defined in {@link User}) and
     * update the module's current state.
     *
     * @access public
     * @async
     * @param {AuthContext} context
     * @returns {Promise<User | null>}
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
     * Action method to log current user out and
     * reset the module's current state.
     *
     * @access public
     * @async
     * @param {AuthContext} context
     * @returns {Promise<boolean>}
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
