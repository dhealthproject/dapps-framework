/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @interface LeaderboardEntryDTO
 * @description This interface defines the fields that are returned
 * by the backend runtime for individual entries using the endpoint
 * `/statistics/leaderboards`.
 * endpoint.
 * <br /><br />
 * @example Using the `LeaderboardDTO` interface
 * ```typescript
 * const entry = {
 *   address: "...",
 *   period: "20221117",
 *   periodFormat: "D",
 *   position: 1,
 *   amount: 0,
 * ```
 * <br /><br />
 * #### Properties
 *
 * @param   {string}    address               Contains the address of the user.
 * @param   {string}    period                Contains the "date period" of which this entry aggregates data.
 * @param   {string}    periodFormat          Contains the type of date period used to generate data.
 * @param   {number}    position              Contains a leaderboard position.
 * @param   {number}    amount                Contains an amount of tokens earned during said date period.
 *
 * @since v0.5.0
 */
export interface LeaderboardEntryDTO {
  periodFormat: string;
  period: string;
  address: string;
  position: number;
  amount: number;
}

/**
 * @type LeaderboardDTO
 * @description This class defines an array of leaderboard entries
 * that are defined using {@link LeaderboardEntryDTO}.
 *
 * @since v0.5.0
 */
export type LeaderboardDTO = LeaderboardEntryDTO[];
