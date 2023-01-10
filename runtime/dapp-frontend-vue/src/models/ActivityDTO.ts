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
 * @interface ActivityEntryDTO
 * @description This interface defines the fields that are returned
 * by the backend runtime for individual entries using the endpoint
 * `/activities/{address}`.
 * endpoint.
 * <br /><br />
 * <br /><br />
 * #### Properties
 *
 * @param   {string}    address               Contains the address of the user.
 * @param   {string}    slug                  Contains activity slug composed of the date of the activity.
 * @param   {string}    provider              Contains OAuth provider name.
 * @param   {string}    sport                 Contains sport type, defined by provider when user completes an activity.
 * @param   {number}    elapsedTime           Contains time that user spent on completing activity.
 * @param   {number}    distance              Contains distance completed by user per activity.
 * @param   {number}    elevationGain         Contains elevation gain received per activity.
 *
 * @since v0.5.0
 */
export interface ActivityEntryDTO {
  address: string;
  slug: string;
  provider: string;
  elapsedTime: number;
  distance: number;
  elevationGain: number;
  sport: string;
  avgPace: number;
  assets: any[];
}
