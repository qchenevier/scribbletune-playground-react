const webpack = require("webpack");

module.exports = {
  // mode: "none",
  mode: "development",
  entry: "./src/index.js",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
  },
  output: {
    filename: "main.js",
  },
  node: {
    fs: "empty",
  },
};
