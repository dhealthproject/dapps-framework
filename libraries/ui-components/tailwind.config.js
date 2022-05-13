/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Config
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  // finds TailWind classes in files with listed extensions
  content: ["./src/**/*.{vue,ts,scss}"],
  theme: {
    // overwrites default border radius
    borderRadius: {
      DEFAULT: "40px",
      lg: "40px",
    },
    // overwrites default fonts display
    fontSize: {
      base: ["14px", "21px"], // font-size, line-height
    },
  },
  variants: {},
  plugins: [],
};
