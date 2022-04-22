/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Config
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
module.exports = {
  // disables extract of CSS files
  css: { extract: false },

  configureWebpack: {
    // Disables module splitting to export the library as one package
    // that includes all components when imported.
    optimization: {
      splitChunks: false,
    },
  },

  // enables templates in .vue files
  runtimeCompiler: true,

  // keep filenames untouched during build
  filenameHashing: false,
};
