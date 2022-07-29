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
  content: [
    "./src/components/**/*.{vue,ts,scss}",
    "./src/pages/**/*.{vue,ts,scss}",
    "./src/App.ts",
    "./src/App.vue",
    "./public/index.html",
    "./config/modules/*.json", // enables "card.display.classes"
  ],
  theme: {
    fontFamily: {
      sans: ["Avenir", "Helvetica", "Arial"],
    },
    extend: {
      colors: {
        primary: "#2970ff", // royal blue
        secondary: "#150867", // navy
        tertiary: "#41e3ce", // turquoise
      },
    },
  },
  variants: {},
  plugins: [],
};
