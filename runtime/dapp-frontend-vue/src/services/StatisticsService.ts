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
import moment from "moment";

// internal dependencies
import { BackendService } from "./BackendService";
import { HttpRequestHandler } from "@/kernel/remote/HttpRequestHandler";
import { UserStatisticsDTO } from "@/models/UserStatisticsDTO";

export class StatisticsService extends BackendService {
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
  public async getUserStatistics(
    address: string
  ): Promise<UserStatisticsDTO[]> {
    // configure statistics request
    const params = [
      `period=${moment(new Date()).format("YYYYMMDD")}`,
      `periodFormat=D`,
    ];

    // execute request
    const response = await this.handler.call(
      this.getUrl(`statistics/users/${address}?${params.join("&")}`),
      "GET",
      undefined, // no-body
      {
        withCredentials: true,
        credentials: "include",
      },
      {} // no-headers
    );

    // returns an array of statistics entries
    // PaginatedResultDTO adds one more "data"
    return response.data.data as UserStatisticsDTO[];
  }
}
