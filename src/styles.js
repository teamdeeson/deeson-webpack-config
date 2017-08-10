const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = config => ({
  ...config,
  module: {
    ...config.module || {},
    rules: [
      ...config.module.rules || [],
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {sourceMap: true}
          },
          {
            loader: 'postcss-loader',
            options: {sourceMap: true, plugins: () => [require('autoprefixer')]}
          },
          {
            loader: 'sass-loader',
            options: {sourceMap: true}
          },
        ]),
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {sourceMap: true}
          },
          {
            loader: 'postcss-loader',
            options: {sourceMap: true, plugins: () => [require('autoprefixer')]}
          },
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
          {
            loader: 'image-webpack-loader',
            options: {
              pngquant: {quality: '65-90', speed: 4},
              mozjpeg: {progressive: true},
              gifsicle: {interlaced: false},
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
          {
            loader: 'image-webpack-loader',
            options: {
              pngquant: {quality: '65-90', speed: 4},
              mozjpeg: {progressive: true},
              gifsicle: {interlaced: false},
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...config.plugins || [],
    new ExtractTextPlugin('[name].css'),
  ],
});
