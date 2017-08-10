const get = require('lodash/get');

module.exports = config => ({
  ...config,
  module: {
    ...config.module || {},
    rules: [
      ...get(config, 'module.rules', []),
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['env'],
        },
      },
    ],
  },
});
