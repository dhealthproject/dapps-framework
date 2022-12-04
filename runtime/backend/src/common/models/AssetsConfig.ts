/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @label COMMON
 * @type AssetParameters
 * @description This interface consists of a set of configuration
 * fields that must be provided to configure a custom asset than
 * can be discovered and processed.
 * <br /><br />
 * @example Using the `AssetParameters` type to configure assets
 * ```json
 * {
 *   mosaicId: "39E0C49FA322A459",
 *   namespaceId: "9D8930CDBB417337",
 *   divisibility: 6,
 *   symbol: "DHP"
 * }
 * ```
 *
 * @link AssetsConfig
 * @since v0.3.0
 */
export interface AssetParameters {
  mosaicId: string;
  namespaceId?: string;
  divisibility: string | number;
  symbol: string;
}

/**
 * @label COMMON
 * @type AssetType
 * @description This interface consists of a set of configuration
 * fields that must be provided to configure a custom asset.
 * <br /><br />
 * Note that newly implemented assets **must** be added to this
 * type such that they are correctly understood and configured
 * for the backend runtime endpoints.
 *
 * @link AssetsConfig
 * @since v0.3.0
 */
export type AssetType = string | "base" | "earn";

/**
 * @label COMMON
 * @type BoosterGroup
 * @description This interface consists of a set of configuration
 * fields that must be provided to configure a booster asset.
 * <br /><br />
 * Note that newly implemented boosters **must** be added to this
 * type such that they are correctly understood and configured
 * for the backend runtime endpoints.
 *
 * @link AssetsConfig
 * @since v0.3.0
 */
export type BoosterGroup = string | "referral" | "progress";

/**
 * @label COMMON
 * @type DiscoverableAssetsMap
 * @description A discoverable asset configuration object.
 * This configuration field consists of a key as listed
 * in {@link AssetType} and a parameters object as
 * defined by {@link AssetParameters}.
 *
 * @link AssetsConfig
 * @since v0.3.0
 */
export type DiscoverableAssetsMap = {
  [key: AssetType]: AssetParameters;
};

/**
 * @label COMMON
 * @type BoosterAssetsMap
 * @description A discoverable asset configuration object.
 * This configuration field consists of a key as listed
 * in {@link BoosterGroup} and a configuration object as
 * defined by {@link DiscoverableAssetsMap}.
 *
 * @link AssetsConfig
 * @since v0.3.0
 */
export type BoosterAssetsMap = {
  [key: BoosterGroup]: DiscoverableAssetsMap;
};

/**
 * @label COMMON
 * @interface AssetsConfig
 * @description The dApp assets configuration. This configuration
 * object is used to determine which *mosaics* are used from the
 * dHealth Network and how they should be formatted.
 *
 * @link AssetsConfig:CONFIG
 * @since v0.3.0
 */
export interface AssetsConfig {
  /**
   * A discoverable asset configuration object. This
   * configuration field consists of a key as listed
   * in {@link AssetType} and a parameters object as
   * defined by {@link AssetParameters}.
   * <br /><br />
   * @example Example assets configuration object
   * ```json
   * {
   *   assets: {
   *     base: { ... },
   *     earn: { ... }
   *   }
   * }
   * ```
   *
   * @link DiscoverableAssetsMap
   * @access public
   * @var {DiscoverableAssetsMap}
   */
  assets: DiscoverableAssetsMap;

  /**
   * A payable *booster* assets configuration object.
   * This configuration field consists of a *booster group*
   * and {@link AssetParameters} map.
   * <br /><br />
   * @example Example boosters configuration object
   * ```json
   * {
   *   boosters: {
   *     referral: {
   *       boost5: { ... },
   *       boost10: { ... },
   *       boost15: { ... }
   *     }
   *   }
   * }
   * ```
   *
   * @link BoosterGroup
   * @link DiscoverableAssetsMap
   * @access public
   * @var {BoosterAssetsMap}
   */
  boosters?: BoosterAssetsMap;
}
