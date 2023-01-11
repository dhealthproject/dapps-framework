/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend Configuration
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @label CONFIG
 * @module SocialConfig
 * @description The dApp social networks share configuration. This
 * configuration defines list and params of the social networks
 * in which dapp can share referral codes.
 *
 * @since v0.5.0
 */
export default () => ({
  /**
   * A social platforms configuration object. This object contains
   * information for the integration of features like: *share*, *like*
   * amongst others.
   * <br /><br />
   * @example Example social networks share configuration object
   * ```json
   * {
   *   socialApps: {
   *     "example": { shareUrl: "example.com/share-this" }
   *   }
   * }
   * ```
   * @var {ShareListsMap}
   */
  socialApps: {
    "whatsapp": {
      icon: "share/whatsapp.svg",
      title: "WhatsApp",
      shareUrl: `whatsapp://send?text=${process.env.FRONTEND_URL}/%REFERRAL_CODE%`,
    },
    "facebook": {
      icon: "share/facebook.svg",
      title: "Facebook",
      appUrl: "https://www.facebook.com/ELEVATE",
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=#${process.env.FRONTEND_URL}/%REFERRAL_CODE%`,
    },
    "twitter": {
      icon: "share/twitter.svg",
      title: "Twitter",
      shareUrl: `http://twitter.com/share?text=Join me on Elevate&url=${process.env.FRONTEND_URL}/%REFERRAL_CODE%&hashtags=fitness,sports`,
    },
    "linkedin": {
      icon: "share/linkedin.svg",
      title: "LinkedIn",
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${process.env.FRONTEND_URL}/%REFERRAL_CODE%`,
    },
    "discord": {
      icon: "share/discord.svg",
      title: "Discord",
      shareUrl: "",
    },
    "telegram": {
      icon: "share/telegram.svg",
      title: "Telegram",
      shareUrl: `https://telegram.me/share/url?url=${process.env.FRONTEND_URL}/%REFERRAL_CODE%&text=Join me on Elevate`,
    }
  },

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
   * @var {ReferralBoosterParameters}
   */
  referral: {
    "boost5": { minReferred: 10 },
    "boost10": { minReferred: 50 },
    "boost15": { minReferred: 100 },
  }
});
