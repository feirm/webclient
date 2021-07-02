const { GitRevisionPlugin } = require("git-revision-webpack-plugin");
const webpack = require("webpack");

const gitRevisionPlugin = new GitRevisionPlugin();

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
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          COMMIT_HASH: JSON.stringify(gitRevisionPlugin.commithash()),
        },
      }),
    ],
  },
};
