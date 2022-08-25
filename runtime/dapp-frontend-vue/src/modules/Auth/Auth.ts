/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import { BackendService } from "@/service/BackendService";
import { AxiosResponse } from "axios";

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
export class Auth extends BackendService {
  /**
   * Api method for receiving message for QR code
   *
   * @returns {Promise}
   */
  public async getAuthChallenge(): Promise<
    AxiosResponse<any, any> | undefined
  > {
    // request an authentication challenge
    const response = await this.handler.call(
      "GET",
      this.getUrl("auth/challenge"),
      {}
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
  public async login(
    challenge: string,
  ): Promise<AxiosResponse<any, any> | undefined> {
    // request an access token for authenticated users
    // a token will only be returned given the challenge
    // was successfully found in a dHealth Network transfer
    const response = await this.handler.call("POST", this.getUrl("auth/token"), {
      challenge,
    });

    // responds with the complete access token payload
    // if this is the initial token creation for
    // an account, this will contain a `refreshToken`
    return response.data;
  }
}
