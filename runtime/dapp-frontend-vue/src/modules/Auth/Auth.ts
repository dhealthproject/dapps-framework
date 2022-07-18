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
    const res = await this.handler.call(
      "GET",
      this.getUrl("auth/challenge"),
      {}
    );
    console.log(res);
    return res;
  }

  /**
   * Api method for receiving auth token
   *
   * @param  {{authCode:string;address:string;}} config
   * @returns Promise
   */
  public async login(config: {
    authCode: string;
    address: string;
  }): Promise<AxiosResponse<any, any> | undefined> {
    const { authCode, address } = config;
    const res = await this.handler.call("POST", this.getUrl("auth/token"), {
      authCode,
      address,
    });
    return res;
  }
}
