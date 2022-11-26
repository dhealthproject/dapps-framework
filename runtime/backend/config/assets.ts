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
 * @module AssetsConfig
 * @description The dApp assets configuration. This configuration
 * object is used to determine assets discovery information as
 * listed below:
 * <br /><br />
 * 1. A config object for base and reward assets information include:
 *  - A base asset config object, containing dHealth native token information (`DHP`).
 *  - An earning asset config object, containing the information of the token used to reward activities.
 * 2. A config object for the BOOST reward assets include:
 *  - The information of the token that is used to reward users for 5 referrals.
 *  - The information of the token that is used to reward users for 10 referrals.
 *  - The information of the token that is used to reward users for 15 referrals.
 * 3. A config object for the PROGRESS reward assets include:
 *  - The information of the token that is used to reward users for achieving 1km distance.
 * <br /><br />
 * CAUTION: By modifying the content of this configuration field,
 * *changes* may occur for the assets discovery schedulers and may
 * thereby affect the data loaded by the backend runtime.
 *
 * @since v0.3.2
 */
export default () => ({
  /**
   * The config object for base and reward assets information.
   *
   * @var {{ base: object, earn: object }}
   */
  assets: {
    /**
     * The config information of the dHealth native token (`DHP`).
     *
     * @example `{ mosaicId: "123ABC", namespaceId: "123ABC", divisibility: 6, symbol: "ABC" }`
     * @var {object}
     */
    base: {
      /**
       * The mosaic Id of dHealth's native token (`DHP`) in hexadecimals.
       *
       * @example `"1234567890ABCDEF"`
       * @var {string}
       */
      mosaicId: "39E0C49FA322A459",

      /**
       * The namespace Id of dHealth's native token (`DHP`) in hexadecimals.
       *
       * @example `"1234567890ABCDEF"`
       * @var {string}
       */
      namespaceId: "9D8930CDBB417337",

      /**
       * The divisibility of dHealth's native token (`DHP`).
       *
       * @example `123456`
       * @var {number}
       */
      divisibility: 6,

      /**
       * The symbol of dHealth's native token (`DHP`).
       *
       * @example `"DHP"`
       * @var {string}
       */
      symbol: "DHP"
    },

    /**
     * An earning asset config object, containing the information of the token used to reward activities.
     *
     * @example `{ mosaicId: "123ABC", divisibility: 6, symbol: "ABC" }`
     * @var {object}
     */
    earn: {
      /**
       * The mosaic Id of the activity reward token in hexadecimals.
       *
       * @example `"123ABC"`
       * @var {string}
       */
      mosaicId: process.env.ASSETS_EARN_IDENTIFIER,

      /**
       * The divisibility of the activity reward token.
       *
       * @example `6`
       * @var {number}
       */
      divisibility: parseInt(process.env.ASSETS_EARN_DIVISIBILITY),

      /**
       * The symbol of the activity reward token.
       *
       * @example `"FIT"`
       * @var {string}
       */
      symbol: process.env.ASSETS_EARN_SYMBOL
    }
  },

  /**
   * The config object for `BOOST` reward assets.
   *
   * @var { referral: { boost5: object, boost10: object, boost15: object } }
   */
  boosters: {
    /**
     * The config object for referral reward assets information.
     *
     * @var { boost5: object, boost10: object, boost15: object }
     */
    referral: {
      /**
       * The information of the token that is used to reward users for 5 referrals (boost5).
       *
       * @example `{ mosaicId: "123ABC", divisibility: 6, symbol: "ABC" }`
       * @var { mosaicId: string, divisibility: number, symbol: string }
       */
      boost5: {
        /**
         * The mosaic Id of the boost5 reward token in hexadecimals.
         *
         * @example `"123ABC"`
         * @var {string}
         */
        mosaicId: process.env.ASSETS_BOOST5_IDENTIFIER,

        /**
         * The divisibility of the boost5 reward token in hexadecimals.
         * <br /><br />
         * Note that this value is 0, meaning that this token is not divisible and thus
         * cannot have be stored or transferred with values that are not integers.
         *
         * @example `0`
         * @var {number}
         */
        divisibility: parseInt(process.env.ASSETS_BOOST5_DIVISIBILITY),

        /**
         * The symbol of the boost5 reward token in hexadecimals.
         *
         * @example `"BOOST"`
         * @var {string}
         */
        symbol: process.env.ASSETS_BOOST5_SYMBOL
      },

      /**
       * The information of the token that is used to reward users for 10 referrals (boost10).
       *
       * @example `{ mosaicId: "123ABC", divisibility: 6, symbol: "ABC" }`
       * @var { mosaicId: string, divisibility: number, symbol: string }
       */
      boost10: {
        /**
         * The mosaic Id of the boost10 reward token in hexadecimals.
         *
         * @example `"123ABC"`
         * @var {string}
         */
        mosaicId: process.env.ASSETS_BOOST10_IDENTIFIER,

        /**
         * The divisibility of the boost10 reward token in hexadecimals.
         * <br /><br />
         * Note that this value is 0, meaning that this token is not divisible and thus
         * cannot have be stored or transferred with values that are not integers.
         *
         * @example `0`
         * @var {number}
         */
        divisibility: parseInt(process.env.ASSETS_BOOST10_DIVISIBILITY),

        /**
         * The symbol of the boost10 reward token in hexadecimals.
         *
         * @example `"BOOST"`
         * @var {string}
         */
        symbol: process.env.ASSETS_BOOST10_SYMBOL
      },

      /**
       * The information of the token that is used to reward users for 15 referrals (boost15).
       *
       * @example `{ mosaicId: "123ABC", divisibility: 6, symbol: "ABC" }`
       * @var { mosaicId: string, divisibility: number, symbol: string }
       */
      boost15: {
        /**
         * The mosaic Id of the boost15 reward token in hexadecimals.
         *
         * @example `"123ABC"`
         * @var {string}
         */
        mosaicId: process.env.ASSETS_BOOST15_IDENTIFIER,

        /**
         * The divisibility of the boost15 reward token in hexadecimals.
         * <br /><br />
         * Note that this value is 0, meaning that this token is not divisible and thus
         * cannot have be stored or transferred with values that are not integers.
         *
         * @example `0`
         * @var {number}
         */
        divisibility: parseInt(process.env.ASSETS_BOOST15_DIVISIBILITY),

        /**
         * The symbol of the boost15 reward token in hexadecimals.
         *
         * @example `"BOOST"`
         * @var {string}
         */
        symbol: process.env.ASSETS_BOOST15_SYMBOL
      },
    },
    /**
     * The config object for `PROGRESS` reward assets.
     *
     * @var { progress: { progress1: object } }
     */
    progress: {
      /**
       * The information of the token that is used to reward users for achieving
       * a progress of 1km.
       *
       * @example `{ mosaicId: "123ABC", divisibility: 0, symbol: "ABC" }`
       * @var { mosaicId: string, divisibility: number, symbol: string }
       */
      progress1: {
        /**
         * The mosaic Id of the progress1 reward token in hexadecimals.
         *
         * @example `"123ABC"`
         * @var {string}
         */
        mosaicId: process.env.ASSETS_PROGRESS1_IDENTIFIER,

        /**
         * The divisibility of the progress1 reward token in hexadecimals.
         * <br /><br />
         * Note that this value is 0, meaning that this token is not divisible and thus
         * cannot have be stored or transferred with values that are not integers.
         *
         * @example `0`
         * @var {number}
         */
        divisibility: parseInt(process.env.ASSETS_PROGRESS1_DIVISIBILITY),

        /**
         * The symbol of the progress1 reward token in hexadecimals.
         *
         * @example `"BOOST"`
         * @var {string}
         */
        symbol: process.env.ASSETS_PROGRESS1_SYMBOL
      },
    }
  },
});
