const path = require("path");

module.exports = {
  mode: "development",
  output: {
    path: path.join(__dirname, "public"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: "last 2 Chrome versions",
                  },
                },
              ],
            ],
            plugins: [
              "@babel/plugin-proposal-nullish-coalescing-operator",
              "./src/lib/babel-plugin-transform-render-function.js",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(svg|jpg)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
          },
        },
      },
    ],
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "public"),
    proxy: {
      "/api": "http://localhost:8081",
    },
  },
};
