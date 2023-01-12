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
 * @interface ConfigDTO
 * @description This interface defines the fields that are returned
 * by the backend runtime for individual entries using the endpoint
 * `/config`.
 * endpoint.
 * <br /><br />
 * @example Using the `ConfigDTO` interface
 * ```typescript
 * const entry = {
 *   dappName: "ELEVATE",
 *   authRegistry: "NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY",
 *   earnAssetDivisibility: 2,
 *   earnAssetIdentifier: "39E0C49FA322A459";
 * ```
 * <br /><br />
 * #### Properties
 *
 * @param   {string}    dappName          Contains name of the dapp.
 * @param   {string}    authRegistry      Contains the address of dHealth Account used as a registry for authentication.
 * @param   {number}    earnAssetDivisibility      Contains amount of symbols that will be displayed after formatting.
 * @param   {string}    earnAssetIdentifier          Contains mosaic id of token.
 * @param   {{ minReferred: number }[]}    referralLevels          Contains the referral levels configuration.
 *
 * @since v0.5.0
 */

export interface ConfigDTO {
  dappName: string;
  authRegistry: string;
  earnAssetDivisibility: number;
  earnAssetIdentifier: string;
  referralLevels: { minReferred: number }[];
}
