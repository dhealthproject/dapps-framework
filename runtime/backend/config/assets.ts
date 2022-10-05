/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend Configuration
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

export default () => ({
  assets: {
    base: {
      mosaicId: "39E0C49FA322A459",
      namespaceId: "9D8930CDBB417337",
      divisibility: 6,
      symbol: "DHP"
    },

    earn: {
      mosaicId: "4ADBC6CEF9393B90",
      divisibility: 6,
      symbol: "FIT"
    }
  },
  boosters: {
    referral: {
      boost5: {
        mosaicId: "55E3CA759248A895",
        divisibility: 0,
        symbol: "BOOST"
      },
      boost10: {
        mosaicId: "2CAA578DEE9043C4",
        divisibility: 0,
        symbol: "BOOST"
      },
      boost15: {
        mosaicId: "002CE74736C839FE",
        divisibility: 0,
        symbol: "BOOST"
      },
    }
  },
});
