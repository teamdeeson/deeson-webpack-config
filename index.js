const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const DrupalTemplatePlugin = require('./drupal-templates-webpack-plugin');
const autoprefixer = require('autoprefixer');

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
          presets: ['es2015'],
        },
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        }),
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)(\?v=\d+\.\d+\.\d+)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              hash: 'sha512',
              digest: 'hex',
              name: '[hash].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              pngquant: { quality: '65-90', speed: 4 },
              mozjpeg: { progressive: true },
              gifsicle: { interlaced: false },
            },
          },
        ],
      },
      { test: /\.(tpl\.php|html\.twig)$/, loader: 'file-loader', options: { regExp: '.*/src/(.*)', name: '[1]' }, exclude: [/pages/] },
      { test: /(\.php|\.twig)$/, loader: 'file-loader', options: { name: 'pages/[name].[ext]' }, exclude: [/src/] },

      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
      { test: /\.(woff|woff2)$/, loader: 'url-loader', options: { prefix: 'font/', limit: 5000 } },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/octet-stream' } },
    ],
  },
  plugins: [
    new WriteFilePlugin({ log: false }),
    new DrupalTemplatePlugin(),
    new ExtractTextPlugin('[name].css'),
    new webpack.LoaderOptionsPlugin({ options: { postcss: [autoprefixer] } }),
  ],
};

module.exports = config;
