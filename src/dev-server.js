const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = config => ({
  // TODO needs node 8.3.
  ...config,
  devServer: {
    inline: true,
    quiet: false,
    noInfo: false,
    https: true,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
    },
    proxy: {
      '*': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [
    ...config.plugins || [],
    new WriteFilePlugin({ log: false }),
  ],
});
