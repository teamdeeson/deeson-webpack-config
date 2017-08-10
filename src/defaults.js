const path = require('path');

module.exports = (config = {}) => ({
  ...config,
  entry: {
    ...config.entry || {},
    app: './src/app.js',
    pages: './pages/index.js',
  },
  output: {
    ...config.output || {},
    path: path.resolve(process.cwd(), 'assets'),
    publicPath: 'needs-to-be-set',
    filename: '[name].js',
  },
});
