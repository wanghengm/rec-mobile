const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
module.exports = {
  entry: {
    index: "./packages/index.js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/, //babel-loader优化：1.不编译不需要的文件了
        use: [
          {
            loader: "babel-loader?cacheDirectory", //babel-loader优化：2.对于es6的代码设置缓存，第一次编译完成，第二次这些代码没有改动过，就不用在二次编译了，直接取缓存的东西就可以了
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: "asset/resource",
      },
      {
        test: /\.svg/,
        type: "asset/inline",
      },
      {
        test: /\.txt/,
        type: "asset/source",
      },
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   filename: "index.html",
    //   template: path.resolve(__dirname, "../public/index.html"),
    //   chunks: ["index", "common", "vendor"], //在index.html中引入 index.js 自己封装的公共逻辑common.js文件 以及倒入的第三方库比如lodash
    // }),
    // new HtmlWebpackPlugin({
    //   filename: "other.html",
    //   template: path.resolve(__dirname, "../public/other.html"),
    //   chunks: ["other", "common", "vendor"],
    // }),
  ],
};
