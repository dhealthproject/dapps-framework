/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { BackendService } from "./BackendService";
import { HttpRequestHandler } from "@/kernel/remote/HttpRequestHandler";
import { User } from "@/models/User";

/**
 * @todo missing interface documentation
 */
export interface AccessTokenDTO {
  accessToken: string;
  refreshToken?: string;
}

/**
 * @class AuthService
 * @description This class handles managing
 * of authentication related actions.
 * <br /><br />
 * Currently includes 2 methods which
 * are responsible for getting QR code authCode and accessToken
 * @example Using the Auth class
 * ```typescript
 *   const auth = new Auth();
 *   console.log(auth.getAuthChallenge());
 * ```
 *
 * @todo Should *randomly* select one of the multiple authentication registries
 * @todo Should include the selected registry in the /auth/challenge request
 * @since v0.2.0
 */
export class AuthService extends BackendService {
  /**
   * This property sets the request handler used for the implemented
   * requests. This handler forwards the execution of the request to
   * `axios`.
   *
   * @access protected
   * @returns {HttpRequestHandler}
   */
  protected get handler(): HttpRequestHandler {
    return new HttpRequestHandler();
  }

  /**
   * This method executes a backend API request to
   * the endpoint `/auth/challenge` to generate an
   * authentication challenge that is then attached
   * to a QR Code to perform authentication on-chain.
   *
   * @access public
   * @async
   * @returns {Promise<string>}
   */
  public async getChallenge(): Promise<string> {
    // request an authentication challenge
    const response = await this.handler.call(
      this.getUrl("auth/challenge"),
      "GET",
      undefined, // no-body
      { withCredentials: true, credentials: "include" }
      // no-headers
    );

    // responds with just the challenge content
    return response.data.challenge;
  }

  /**
   * This method executes a backend API request to
   * the endpoint `/auth/token` to retrieve a user's
   * access/refresh token [pair].
   * <br /><br />
   * Note that this method will only be successful after
   * an authentication challenge was included correctly
   * inside a transaction on dHealth Network.
   *
   * @access public
   * @async
   * @param   {string}    challenge     The authentication challenge that was used to perform sign-in (on-chain).
   * @returns {Promise<AccessTokenDTO>}
   */
  public async login(
    challenge: string,
    registry: string,
    refCode: string | undefined = undefined
  ): Promise<AccessTokenDTO> {
    // request an access token for authenticated users
    // a token will only be returned given the challenge
    // was successfully found in a dHealth Network transfer
    const response = await this.handler.call(
      this.getUrl("auth/token"),
      "POST",
      { challenge, registry, referralCode: refCode },
      { withCredentials: true, credentials: "include" }
      // no-headers
    );

    // responds with the complete access token payload
    // if this is the initial token creation for
    // an account, this will contain a `refreshToken`
    return response.data as AccessTokenDTO;
  }

  /**
   * This method executes a backend API request to
   * the endpoint `/auth/logout` to revoke the user's
   * access token (sign-out / log-out).
   *
   * @returns {Promise<boolean>}
   */
  public async logout(): Promise<boolean> {
    // request an authentication challenge
    const response = await this.handler.call(
      this.getUrl("auth/logout"),
      "POST",
      undefined, // no-body
      { withCredentials: true, credentials: "include" }
      // no-headers
    );

    return response.status === 200;
  }

  /**
   * This method executes a backend API request to
   * the endpoint `/me` and returns the authenticated
   * user's profile information.
   *
   * @returns {Promise<User>}
   */
  public async getProfile(): Promise<User> {
    // request an authentication challenge
    const response = await this.handler.call(
      this.getUrl("me"),
      "GET",
      undefined, // no-body
      { withCredentials: true, credentials: "include" }
      // no-headers
    );

    // responds with the user's profile
    return response.data as User;
  }
}
