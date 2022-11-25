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
import { LeaderboardEntryDTO } from "@/models/LeaderboardDTO";

/**
 * @class LeaderboardService
 * @description This class handles managing
 * of leaderboard related actions
 * <br /><br />
 * Currently includes 1 method,
 * which is responsible for fetching of leaders list, which will be rendered in <Leaderboard /> component
 * @example Using the LeaderboardService class
 * ```typescript
 *   const leaderBoardService = new LeaderboardService();
 *   console.log(leaderBoardService.getLeaderboard());
 * ```
 *
 * @since v0.3.2
 */
export class LeaderboardService extends BackendService {
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
   * Get request for receiving list of the items for Leaderboard

   * @access public
   * @async
   * @param   {string}    period    Period of time for Leaderboard(monthly, weekly) 
   * @param   {string}    period    Period of time for Leaderboard(monthly, weekly) 
   * @returns {Promise<LeaderboardItem[]>}
   */
  public async getLeaderboard(
    periodFormat: string = "D"
  ): Promise<LeaderboardEntryDTO[]> {
    // configure statistics request
    const format = this.getDateFormatForPeriod(periodFormat);
    const params = [
      `period=${moment(new Date()).format(format)}`,
      `periodFormat=${periodFormat}`,
    ];

    const response = await this.handler.call(
      this.getUrl(`statistics/leaderboards?${params.join("&")}`),
      "GET",
      {}, // no-body
      { withCredentials: true, credentials: "include" }
    );

    // responds with array of Leaderboard items
    // PaginatedResultDTO adds one more "data"
    return response.data.data as LeaderboardEntryDTO[];
  }

  /**
   *
   */
  public async getUserLeaderboard(
    userAddress: string,
    periodFormat: string = "D"
  ): Promise<LeaderboardEntryDTO> {
    // configure statistics request
    const format = this.getDateFormatForPeriod(periodFormat);
    const params = [
      `period=${moment(new Date()).format(format)}`,
      `periodFormat=${periodFormat}`,
    ];

    const response = await this.handler.call(
      this.getUrl(`statistics/leaderboards/${userAddress}?${params.join("&")}`),
      "GET",
      {}, // no-body
      { withCredentials: true, credentials: "include" }
    );

    // responds with a singular Leaderboard item
    return response.data as LeaderboardEntryDTO;
  }
}
