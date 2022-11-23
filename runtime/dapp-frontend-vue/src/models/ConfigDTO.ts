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
 *   dappName: "Elevate",
 *   digitsAmount: 2,
 *   mosaicId: "39E0C49FA322A459";
 * ```
 * <br /><br />
 * #### Properties
 *
 * @param   {string}    dappName          Contains name of the dapp.
 * @param   {number}    digitsAmount      Contains amount of symbols that will be displayed after formatting.
 * @param   {string}    mosaicId          Contains mosaic id of token.
 *
 * @since v0.5.0
 */

export interface ConfigDTO {
  dappName: string;
  digitsAmount: number;
  mosaicId: string;
}
