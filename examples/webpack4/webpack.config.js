// const config = require('deeson-webpack-config-starter');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const DrupalTemplatePlugin = require('./drupal-templates-webpack-plugin');

// process.noDeprecation = true;

const path = require('path');

const config = {
  entry: './src/app.js',
  mode: 'development',
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
      chunkModules: false
    },
    proxy: {
      '*': {
        target: 'http://localhost:3000',
        secure: false
        }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        }
      },
      {
        test: /\.scss$/,
        use : [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true, plugins: () => [ require('autoprefixer') ] } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ],
      },
      {
        test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true, plugins: () => [ require('autoprefixer') ] } }
        ],
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
              context: 'src'
            }
          }
        ]
      },
      {
        issuer: {exclude: /\.scss$/},
        test: /.*\.(gif|png|jpe?g|svg)(\?v=\d+\.\d+\.\d+)?$/i,
        use: [
          {
             loader: 'file-loader',
             options: {
               name: '[path][name].[ext]',
               context: 'src'
             }
          }
        ]
      },
      { test: /\.(tpl\.php|html\.twig)$/, loader: 'file-loader', options: { regExp: '.*/src/(.*)', name: '[1]' }, exclude: [/pages/] },
      // { test: /(\.php|\.twig|\.twig\.html)$/, loader: 'file-loader', options: { name: 'pages/[name].[ext]' }, exclude: [/src/] },
      //
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
      { test: /\.(woff|woff2)$/, loader: 'url-loader', options: { prefix: 'font/', limit: 5000 } },
      { test: /\.[ot]tf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/octet-stream' } },
    ],
  },
  plugins: [
    new WriteFilePlugin({ log: false }),
    new DrupalTemplatePlugin({ ignore: /.*pages.*/ }),
    // new ExtractTextPlugin('[name].css')
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
};

if (typeof process.env.DOCKER_LOCAL !== 'undefined' && process.env.DOCKER_LOCAL === "1") {
  config.devServer.host = "0.0.0.0";
  config.devServer.port = 80;
  config.devServer.https = false;
  config.devServer.disableHostCheck = true;
  config.devServer.proxy['*'].target = 'http://fe-php:80';
  config.watchOptions = config.watchOptions || {};
  config.watchOptions.poll = 1000;
}

// module.exports = config;

// this should be the real asset path in drupal
// so something like /sites/all/themes/blah_blah/assets
config.output.publicPath = '/assets/';

// this is how you get auto reload happening
// for your pages without adding them to ./src/app.js
// config.entry.pages = './pages/index.js';

module.exports = config;
