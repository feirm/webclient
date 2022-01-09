const webpack = require("webpack");

module.exports = {
  pwa: {
    workboxOptions: {
      exclude: [/_redirects/],
    },
  },
  configureWebpack: {
    module: {
      noParse: /\.wasm$/,
      rules: [
        {
          test: /\.wasm$/,
          loaders: ["base64-loader"],
          type: "javascript/auto",
        },
      ],
    }
  },
};
