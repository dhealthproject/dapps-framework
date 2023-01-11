/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { SocialPlatformDTO } from "./SocialPlatformDTO";

/**
 * @label COMMON
 * @type SocialPlatformsMap
 * @description App share configuration object.
 *
 * @link SocialPlatformsMap
 * @since v0.3.0
 */
export type SocialPlatformsMap = {
  [key: string]: SocialPlatformDTO;
};

/**
 * A configuration object that defines the total number of referrals
 * necessary to unlock the corresponding *booster asset*.
 * <br /><br />
 * Note that the keys of this configuration object should contain the
 * *booster asset's identifier* as defined inside `config/assets.ts`.
 *
 * @link ReferralBoosterParameters
 * @since v0.6.0
 */
export type ReferralBoosterParameters = {
  [key: string]: { minReferred: number };
};

/**
 * @label COMMON
 * @interface SocialConfig
 * @description The dApp social networks share configuration. This
 * configuration defines list and params of the social networks
 * in which dapp can share referral codes.
 * @link SocialConfig
 * @since v0.3.0
 */
export interface SocialConfig {
  /**
   * A social platforms configuration object. This object contains
   * information for the integration of features like: *share*, *like*
   * amongst others.
   * <br /><br />
   * @example Example social apps configuration object
   * ```json
   * {
   *   socialApps: {
   *     "example": { shareUrl: "example.com/share-this" }
   *   }
   * }
   * ```
   *
   * @link SocialPlatformsMap
   * @access public
   * @var {SocialPlatformsMap}
   */
  socialApps: SocialPlatformsMap;

  /**
   * A configuration object that determines the total number of referrals
   * that are necessary to be assigned the corresponding booster.
   * <br /><br />
   * Note that the keys of this configuration object should contain the
   * *booster asset's identifier* as defined inside `config/assets.ts`.
   * <br /><br />
   * @example Example referral steps configuration object
   * ```json
   * {
   *   referral: {
   *     "boost5": { minReferred: 5 },
   *     "boost10": { minReferred: 10 },
   *     ...
   *   }
   * }
   * ```
   *
   * @link ReferralBoosterParameters
   * @access public
   * @var {ReferralBoosterParameters}
   */
  referral: ReferralBoosterParameters;
}
