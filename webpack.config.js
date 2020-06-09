const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const path = require("path");

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
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: "Scribbletune playground",
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
};
