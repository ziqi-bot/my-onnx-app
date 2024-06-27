const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  webpack: {
    plugins: [
      new NodePolyfillPlugin(),
      new CopyPlugin({
        patterns: [
          { from: "node_modules/onnxruntime-web/dist/*.wasm", to: "static/js/[name][ext]" },
        ],
      }),
    ],
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "fs": false,
        "path": require.resolve("path-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer/"),
        "vm": require.resolve("vm-browserify"),
      };

      return webpackConfig;
    },
  },
};
