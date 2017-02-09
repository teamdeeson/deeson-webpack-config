const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const DrupalTemplatePlugin = require('./drupal-templates-webpack-plugin');
const autoprefixer = require('autoprefixer');

const extractCSS = new ExtractTextPlugin('[name].css');

const path = require('path');

const config = {
  entry: {
    app: ['./src/app.js'],
  },
  devtool: '#source-map',
  output: {
    path: path.resolve(process.cwd(), 'assets'),
    publicPath: 'needs-to-be-set',
    filename: 'app.js',
  },
  devServer: {
    inline: true,
    quiet: false,
    noInfo: false,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
    },
    outputPath: path.join(process.cwd(), 'assets'),
    proxy: {
      '*': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.scss$/,
        loader: extractCSS.extract(['css-loader', 'postcss-loader', 'sass-loader']),
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)(\?v=\d+\.\d+\.\d+)?$/i,
        loaders: [
          'url?limit=10000&hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
        ],
      },
      { test: /\.(tpl\.php|html\.twig)$/, loaders: ['file?name=components/[name].[ext]'] },

      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
    ],
  },
  plugins: [
    new WriteFilePlugin({ log: false }),
    new DrupalTemplatePlugin(),
    extractCSS,
  ],
  postcss: () => [autoprefixer],
};

module.exports = config;
