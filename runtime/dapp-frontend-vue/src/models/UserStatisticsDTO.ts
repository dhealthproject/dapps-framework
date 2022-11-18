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
 * @type UserDataAggregateDTO
 * @description This type defines the rules of aggregate data that
 * is generate for individual users.
 *
 * @since v0.5.0
 */
export type UserDataAggregateDTO = {
  totalPracticedMinutes: number;
  totalEarned: number;
  topActivities?: string[];
  totalReferral?: number;
  levelReferral?: number;
};

/**
 * @interface UserStatisticsDTO
 * @description This interface defines the fields that are returned
 * by the backend runtime using the `/statistics/user/:address`
 * endpoint.
 * <br /><br />
 * @example Using the `UserStatisticsDTO` interface
 * ```typescript
 * const statistics = {
 *   address: "...",
 *   period: "20221117",
 *   periodFormat: "D",
 *   position: 1,
 *   amount: 0,
 *   data: {
 *     totalPracticedMinutes: 0,
 *     totalEarned: 0,
 *   }
 * ```
 * <br /><br />
 * #### Properties
 *
 * @param   {string}    address               Contains the address of the user.
 * @param   {string}    period                Contains the "date period" of which this entry aggregates data.
 * @param   {string}    periodFormat          Contains the type of date period used to generate data.
 * @param   {number}    position              (Optional) Contains a potential leaderboard position.
 * @param   {number}    amount                (Optional) Contains an amount of tokens earned during said date period.
 * @param   {UserDataAggregateDTO}    data    Contains aggregated data as defined by {@link UserDataAggregateDTO}.
 *
 * @since v0.5.0
 */
export interface UserStatisticsDTO {
  address: string;
  period: string;
  periodFormat: string;
  position?: number;
  amount?: number;
  data: UserDataAggregateDTO;
}
