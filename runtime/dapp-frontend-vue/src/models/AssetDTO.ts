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
 * @interface AssetDTO
 * @description This interface defines the fields that are returned
 * by the backend runtime for individual entries using the endpoint
 * `/assets`.
 * endpoint.
 * <br /><br />
 * @example Using the `AssetDTO` interface
 * ```typescript
 * const entry = {
 *   data: [{
 *      transactionHash: "4288A7ACF51A04AEFFBAA3DC96BCB96F20BA95671C19C3EE9E0443BC0FB79A61",
 *      userAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        creationBlock: 123456,
        assetId: "39E0C49FA322A459",
        amount: 123
 *   }],
    pagination: {}
 * ```
 * <br /><br />
 * #### Properties
 *
 * @param   {string}    data          Contains array of asset entries.
 * @param   {string}    pagination          Contains pagination data.
 *
 * @since v0.5.0
 */
export interface AssetDTO {
  data: AssetEntry[];
  pagination: any;
}

/**
 * @interface AssetEntry
 * @description This interface defines the fields that are included 
 * into `data` field in `/assets` endpoint response.
 * endpoint.
 * <br /><br />
 * @example Using the `AssetDTO` interface
 * ```typescript
 * const entry = {
 *  transactionHash: "4288A7ACF51A04AEFFBAA3DC96BCB96F20BA95671C19C3EE9E0443BC0FB79A61",
 *      userAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        creationBlock: 123456,
        assetId: "39E0C49FA322A459",
        amount: 123
 }
 * ```
 * <br /><br />
 * #### Properties
 *
 * @param   {string}    data          Contains array of asset entries.
 * @param   {string}    pagination          Contains pagination data.
 *
 * @since v0.5.0
 */
export interface AssetEntry {
  transactionHash: string;
  userAddress: string;
  creationBlock: number;
  assetId: string;
  amount: string;
}
