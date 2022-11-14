const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "none",
  entry: "./src/index.ts",
  // devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  plugins: [
    new ESLintPlugin({
      files: ["src/**/*.ts", "src/**/*.js"],
      extensions: ["ts", "js"],
      exclude: ["node_modules", "dist"],
    }),
    new CopyPlugin({
      patterns: [
        { from: "examples/index.html", to: "index.html" },
        { from: "examples/models", to: "models" },
        { from: "examples/textures", to: "textures" },
      ],
    }),
  ],
  resolve: {
    alias: {
      three: path.resolve("./node_modules/three"),
      path: require.resolve("path-browserify"),
    },
    fallback: {
      fs: false,
    },
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 9000,
  },
};

