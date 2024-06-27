const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    "crypto": require.resolve("crypto-browserify"),
    "fs": false,
    "path": require.resolve("path-browserify"),
    "buffer": require.resolve("buffer"),
    "stream": require.resolve("stream-browserify"),
    "vm": require.resolve("vm-browserify"),
    ...config.resolve.fallback,
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  if (config.devServer) {
    config.devServer.headers = {
      ...config.devServer.headers,
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    };
  }

  return config;
};
