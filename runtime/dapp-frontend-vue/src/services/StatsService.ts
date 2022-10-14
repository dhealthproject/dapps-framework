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

export class StatsService extends BackendService {
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
   * This method implements fetching of quick stats
   *
   * @param params
   * @returns
   */
  public async getStats(address: string) {
    return await this.handler.call(
      this.getUrl(`statistics/${address}`),
      "GET",
      undefined, // no-body
      {
        withCredentials: true,
        credentials: "include",
      },
      {} // no-headers
    );
  }
}
