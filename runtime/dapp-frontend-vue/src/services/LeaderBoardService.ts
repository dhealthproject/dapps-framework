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
export interface LeaderBoardItem {
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
 * @todo Should *randomly* select one of the multiple authentication registries
 * @todo Should include the selected registry in the /auth/challenge request
 * @since v0.2.0
 */
export class LeaderBoardService extends BackendService {
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
   * Get request for receiving list of the items for leaderboard

   * @access public
   * @async
   * @param   {string}    which     Type of the leaderboard
   * @param   {string}    period    Period of time for leaderboard(monthly, weekly) 
   * @returns {Promise<LeaderBoardItem[]>}
   */
  public async getLeaderBoard(
    which: string,
    period: string
  ): Promise<LeaderBoardItem[]> {
    const response = await this.handler.call(
      this.getUrl(`leaderboard/${which}/${period}`),
      "GET",
      {}, // no-body
      {} // no-headers
    );

    // responds with array of leaderboard items
    return response.data as LeaderBoardItem[];
  }
}
