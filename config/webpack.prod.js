const path = require("path");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const common = require("./webpack.common.js");
const { webpack } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "../lib"),
    filename: "[name].js",
    publicPath: "/",
    library: {
      name: "recMobile",
      type: "umd",
    },
    // devtoolModuleFilenameTemplate:
    //   "webpack://[namespace]/[resource-path]?[loaders]",
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      //抽离css
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader?sourceMap",
          "postcss-loader",
        ],
      },
      //抽离less
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
        ],
      },
    ],
  },
  plugins: [
    //每次打包都清楚dist文件
    new CleanWebpackPlugin(), //每次打包都会清除 output.path文件夹
    //抽离css文件
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      // filename: "[name].css",
      // sourcemap: true,
    }),
    // new webpack.SourceMapDevToolPlugin({}),
    // new UglifyJsPlugin(),
    //避免引入无用模块,比如moment很大（包括语言等等），但是我们只要moment中的中文，配置完这个之后我们就手动引入需要的东西就可以
    //比如 import "moment/locale/zh-cn";
    // new webpack.IgnorePlugin(/\.\/locale/, /moment/),
  ],
  optimization: {
    //压缩css代码
    minimizer: [
      (compiler) => {
        const TerserPlugin = require("terser-webpack-plugin");
        new TerserPlugin({
          /* your config */
          test: /\.js(\?.*)?$/i,
          // include: /\.js(\?.*)?$/i, //匹配参与压缩的文件
          parallel: true, //使用多进程并发运行
        }).apply(compiler);
      },
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(),
      // new UglifyJsPlugin(),
    ],
    //抽离公共代码逻辑包括第三方库，自己写的公共方法等
    //比如自己封装的js方法，在index.js和other.js文件中引入，打包之后两个文件都会分别吧公共代码打包
    //利用抽离的方式 就可以吧这个公共方法抽离到common.js文件中，打包一次就可以了
    splitChunks: {
      chunks: "all",
      /**
       * initial 入口 chunk，对于异步导入的文件不处理
        async 异步 chunk，只对异步导入的文件处理
        all 全部 chunk
      */
      cacheGroups: {
        // 第三方模块 比如 lodash这些
        vendor: {
          name: "vendor", // chunk 名称
          priority: 1, // 权限更高，优先抽离，重要！！！
          test: /node_modules/,
          minSize: 0, // 大小限制
          minChunks: 1, // 最少复用过几次
        },

        // 公共的模块  比如自己封装的一些公共方法
        common: {
          name: "common", // chunk 名称
          priority: 0, // 优先级
          minSize: 0, // 公共模块的大小限制
          minChunks: 2, // 公共模块最少复用过几次
        },
      },
    },
  },
});
