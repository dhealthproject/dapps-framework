const webpack = require("webpack");

// vue.config.js
module.exports = {
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
  pwa: {
    manifestOptions: {
      name: "dhealth-bridge",
      short_name: "dh-wpa",
      start_url: "./",
      display: "standalone",
      theme_color: "#000000",
      icons: [
        {
          src: "./img/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-maskable-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "./img/icons/android-chrome-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    iconPaths: {
      maskicon: null,
      favicon32: "./favicon32.png",
      favicon16: "./favicon16.png",
      appleTouchIcon: null,
      msTileImage: null,
    },
    // configure the workbox plugin
    workboxPluginMode: "GenerateSW",
  },
};
