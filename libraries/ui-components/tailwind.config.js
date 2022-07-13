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
      md: "5px",
      ml: "10px",
      "3xl": "20px",
      lg: "40px",
    },
    // overwrites default fonts display
    fontSize: {
      base: ["14px", "21px"], // font-size, line-height
      message: ["13px"],
      lg: ["1rem", "1.75rem"], // 16px, 28px
      l: ["18px"], // 18px
      xl: ["1.25rem"],	
      "3xl": ["1.5rem", "2.25rem"],
      "5xl": ["2.5rem", "3.25rem"],
    },
    maxWidth: {
      "3xl": "700px",
      full: "100%"
    }
  },
  variants: {},
  plugins: ["tailwindcss/nesting"],
};
