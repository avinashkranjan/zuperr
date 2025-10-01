import path from "path";
import { fileURLToPath } from "url";
import HtmlWebPackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__filename, "__filename");
console.log(__dirname, "__dirname");

export default {
  entry: "./index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "assets/js/[name].[fullhash].js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
      "@utils": path.resolve(__dirname, "src/utils"),
      "@api": path.resolve(__dirname, "src/api"),
      "@config": path.resolve(__dirname, "src/config"),
      "@base": path.resolve(__dirname, "src/base"),
      "@components/ui": path.resolve(__dirname, "src/components/ui"),
      "@base-components": path.resolve(__dirname, "src/base-components"),
      "@src": path.resolve(__dirname, "src/"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@redux": path.resolve(__dirname, "src/redux"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
    },
  },
  cache: false,
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: "all",
      maxSize: 250000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: 10,
        },
        default: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name].[hash][ext][query]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./index.html",
      filename: "./index.html",
    }),
  ],
};
