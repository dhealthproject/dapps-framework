/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import Cookies from "js-cookie";

// internal dependencies
import { BackendService } from "./BackendService";
import { HttpRequestHandler } from "@/kernel/remote/HttpRequestHandler";

/**
 *
 */
export interface AccessTokenDTO {
  accessToken: string;
  refreshToken?: string;
}

/**
 * @class Auth
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
 * @since v0.2.0
 */
export class AuthService extends BackendService {
  /**
   *
   */
  public static authRegistry = "NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY";

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
   *
   * @returns {boolean}
   */
  public static hasClientAuthorization(): boolean {
    const accessToken = AuthService.getAccessToken();
    return !!accessToken && accessToken.length > 0;
  }

  /**
   * Get authentication cookie
   *
   * @returns string | undefined
   */
  public static getAccessToken(): string {
    return Cookies.get("accessToken") ?? "";
  }

  /**
   * Set authentication cookie
   *
   * @returns void
   */
  public static setAccessToken(accessToken: string) {
    // @todo replace secure: false for the development purposes, should be true
    Cookies.set("accessToken", accessToken, {
      secure: false,
      sameSite: "strict",
      // @todo should use the correct domain name in prod..
      domain: "localhost",
    });
  }

  /**
   * Api method for receiving message for QR code
   *
   * @returns {Promise}
   */
  public async getAuthChallenge(): Promise<string> {
    // request an authentication challenge
    const response = await this.handler.call(
      "GET",
      this.getUrl("auth/challenge")
      // no-body
      // no-options
      // no-headers
    );

    // responds with just the challenge content
    console.log("Auth.getAuthChallenge(): ", response);
    return response.data.challenge;
  }

  /**
   * Api method for receiving auth token
   *
   * @param  {{authCode:string;address:string;}} config
   * @returns Promise
   */
  public async login(challenge: string): Promise<AccessTokenDTO> {
    // request an access token for authenticated users
    // a token will only be returned given the challenge
    // was successfully found in a dHealth Network transfer
    const response = await this.handler.call(
      "POST",
      this.getUrl("auth/token"),
      {
        challenge,
      }
      // no-options
      // no-headers
    );

    // responds with the complete access token payload
    // if this is the initial token creation for
    // an account, this will contain a `refreshToken`
    return response.data as AccessTokenDTO;
  }
}
