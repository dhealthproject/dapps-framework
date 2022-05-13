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
    // defines custom colors for dHealth Design System
    colors: {
      "royal-blue": "#2970ff",
      "royal-blue-600": "#5d64ff",
      "royal-blue-500": "#8085ff",
      "royal-blue-100": "#f9f8ff",
      turquoise: "#41e3ce",
      navy: "#150867",
      tangerine: "#ff8f78",
      violet: "#583dff",
      linen: "#ffefda",
      sand: "#f0efec",
      mint: "#bdebe5",
      white: "#ffffff",
      gray: "#e2e4e8",
      "gray-600": "#525c76",
    },
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
