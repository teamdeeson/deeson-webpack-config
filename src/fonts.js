module.exports = config => ({
  ...config,
  module: {
    ...config.module || {},
    rules: [
      ...config.module.rules || [],
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader',
        options: { prefix: 'font/', limit: 5000 },
      },
      {
        test: /\.[ot]tf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: { limit: 10000, mimetype: 'application/octet-stream' },
      },
    ],
  },
});
