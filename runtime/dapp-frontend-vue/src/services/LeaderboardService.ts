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
/**
 *
 */
export interface LeaderboardItem {
  type: string;
  period: string;
  address: string;
  position: number;
  assets: number;
  avatar: string;
  trendline?: string;
  color?: string;
  activities?: string[];
}

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
   * @param   {string}    which     Type of the Leaderboard
   * @param   {string}    period    Period of time for Leaderboard(monthly, weekly) 
   * @returns {Promise<LeaderboardItem[]>}
   */
  public async getLeaderboard(
    which: string,
    period: string
  ): Promise<LeaderboardItem[]> {
    const response = await this.handler.call(
      this.getUrl(`statistics/leaderboards/${which}?period=${period}`),
      "GET",
      {}, // no-body
      { withCredentials: true, credentials: "include" }
    );

    // responds with array of Leaderboard items
    return response.data as LeaderboardItem[];
  }
}
