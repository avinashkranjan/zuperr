import { merge } from "webpack-merge";
import commonConfig from "./webpack.common.js";
import dotenv from "dotenv";

dotenv.config();

const devConfig = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    port: process.env.PORT || 9090,
    host: "0.0.0.0",
    historyApiFallback: true,
    compress: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
    ],
  },
  plugins: [],
};

export default merge(commonConfig, devConfig);
