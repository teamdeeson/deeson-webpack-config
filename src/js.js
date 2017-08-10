module.exports = config => ({
  ...config,
  module: {
    ...config.module || {},
    rules: [
      ...config.module.rules || [],
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
