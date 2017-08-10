
const path = require('path');
const { flow } = require('lodash');

process.noDeprecation = true;

const makeConfig = flow(
  require('./src/js'),
  require('./src/dev-server'),
  require('./src/styles'),
  require('./src/drupal'),
  require('./src/fonts'),
);

const config = {
  entry: {
    app: './src/app.js',
    pages: './pages/index.js',
  },
  devtool: '#source-map',
  output: {
    path: path.resolve(process.cwd(), 'assets'),
    publicPath: 'needs-to-be-set',
    filename: '[name].js',
  },
};

module.exports = makeConfig(config);
