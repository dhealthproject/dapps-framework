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
  assetsDir: "@dhealth",

  // disables extract of CSS files
  css: { extract: false },

  configureWebpack: {
    // Disables module splitting to export the library as one package
    // that includes all components when imported.
    optimization: {
      splitChunks: false,
    },

    // Disables bundling of the listed modules so that they are
    // requested at runtime from the environment.
    externals: {
      "canvas": {},
      "utf-8-validate": {},
      "bufferutil": {},
    },

    // configures polyfills
    resolve: {
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer")
      },
    },

    // Disables performance hints (warnings) about entrypoint
    // sizes such that no warnings are emitted for the library
    performance: {
      hints: false,
    },

    module: {
      rules: [
        {
          test: /\.s[ac]ss$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  shadowMode: true,
                },
              },
            }
          ],
        }
      ]
    },
  },

  // enables templates in .vue files
  runtimeCompiler: true,

  // keep filenames untouched during build
  filenameHashing: false,
};
