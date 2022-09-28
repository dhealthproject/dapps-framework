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

export class IntegrationsService extends BackendService {
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
   * @param provider
   */
  public authorize(provider: string, address: string): void {
    // prepares backend request
    // @todo should add compatibility with referral code
    const query: string = `?dhealthAddress=${address}`;

    // CAUTION: this uses `window.location` to redirect the
    // user *forcefully* using the backend runtime to authorize.
    window.location.href = this.getUrl(`/oauth/${provider}/authorize${query}`);
  }

  /**
   *
   * @param params
   * @returns
   */
  public async callback(params: any) {
    return await this.handler.call(
      this.getUrl("oauth/strava/callback"),
      "GET",
      undefined, // no-body
      {
        withCredentials: true,
        credentials: "include",
        params,
      },
      {} // no-headers
    );
  }
}
