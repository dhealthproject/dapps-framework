/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Config
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
const webpack = require("webpack");

// internal dependencies
// eslint-disable-next-line
const metaConfig = require("./config/meta.json");

/**
 * Exports the configuration for the Vue app. This also
 * contains the manifest configuration under `pwa` and
 * a webpack bundler configuration extension as set in
 * `chainWebpack`.
 *
 * @see https://vuejs.org/api/application.html#app-config
 */
module.exports = {
  // inlines vue-meta
  transpileDependencies: ["vue-meta"],

  // configures polyfills
  configureWebpack: (config) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      })
    );
    config.resolve = {
      ...config.resolve,
      ...{
        fallback: {
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
          buffer: require.resolve("buffer"),
        },
      },
    };
  },

  // configures htmlWebpackPlugin
  chainWebpack: (config) => {
    // sets custom <title> content, author and description meta
    config.plugin("html").tap((args) => {
      args[0].title = metaConfig.manifest.name;
      return args;
    });
  },

  // configures SPA
  pwa: {
    // theme / branding
    themeColor: "#FFFFFF",
    msTileColor: "#FFFFFF",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "default",
    appleMobileWebAppTitle: metaConfig.manifest.name,

    // assets are referred to with relative URLs
    // webpack auto-generates an URL internally
    iconPaths: {
      maskicon: null,
      faviconSVG: "img/icons/favicon.svg",
      favicon32: "img/icons/favicon.32x32.png",
      favicon16: "img/icons/favicon.16x16.png",
      appleTouchIcon: "img/icons/apple-touch-72x72.png",
      msTileImage: "img/icons/msapplication-icon-144x144",
    },

    // configures the workbox plugin
    workboxPluginMode: "GenerateSW",

    // configures WebApp manifest
    // assets are referred to with relative URLs
    // webpack auto-generates an URL internally
    manifestOptions: {
      name: metaConfig.manifest.name,
      short_name: metaConfig.manifest.short_name,
      description: metaConfig.manifest.description,
      categories: ["utilities"],
      lang: "en-US",
      scope: ".",
      start_url: ".",
      display: "standalone",
      theme_color: "#FFFFFF",
      icons: [
        {
          src: "img/icons/apple-touche-72x72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          src: "img/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "img/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "img/icons/android-chrome-maskable-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "img/icons/android-chrome-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],

      // configures related applications
      // "related_applications": [
      //   {
      //     "platform": "play",
      //     "url": "https://play.google.com/store/apps/details?id=com.dhealth.wallet",
      //     "id": "com.dhealth.wallet"
      //   },
      // ],
      // "prefer_related_applications": true,
    },
  },
};
