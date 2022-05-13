/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Config
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
module.exports = () => ({
  map: {
    inline: false,
    annotation: true,
    sourcesContent: true,
  },
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {
      cascade: false,
    },
  },
});
