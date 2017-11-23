const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const DrupalTemplatePlugin = require('./drupal-templates-webpack-plugin');

process.noDeprecation = true;

const path = require('path');

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
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['env'],
        },
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract([
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true, plugins: () => [ require('autoprefixer') ] } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ]),
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract([
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true, plugins: () => [ require('autoprefixer') ] } },
        ]),
      },
      {
        issuer: /\.scss$/,
        test: /.*\.(gif|png|jpe?g|svg)(\?v=\d+\.\d+\.\d+)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: '[path][name].[ext]',
              context: 'src',
            },
          },
        ],
      },
      {
        issuer: {exclude: /\.scss$/},
        test: /.*\.(gif|png|jpe?g|svg)(\?v=\d+\.\d+\.\d+)?$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src',
            },
          },
        ],
      },
      { test: /\.(tpl\.php|html\.twig)$/, loader: 'file-loader', options: { regExp: '.*/src/(.*)', name: '[1]' }, exclude: [/pages/] },
      { test: /(\.php|\.twig)$/, loader: 'file-loader', options: { name: 'pages/[name].[ext]' }, exclude: [/src/] },

      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
      { test: /\.(woff|woff2)$/, loader: 'url-loader', options: { prefix: 'font/', limit: 5000 } },
      { test: /\.[ot]tf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/octet-stream' } },
    ],
  },
  plugins: [
    new WriteFilePlugin({ log: false }),
    new DrupalTemplatePlugin({ ignore: /.*pages.*/ }),
    new ExtractTextPlugin('[name].css'),
  ],
};

module.exports = config;
