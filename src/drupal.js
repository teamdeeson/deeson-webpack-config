const DrupalTemplatePlugin = require('../drupal-templates-webpack-plugin');

module.exports = config => ({
  ...config,
  module: {
    ...config.module || {},
    rules: [
      ...config.module.rules || [],
      { test: /\.(tpl\.php|html\.twig)$/, loader: 'file-loader', options: { regExp: '.*/src/(.*)', name: '[1]' }, exclude: [/pages/] },
      { test: /(\.php|\.twig)$/, loader: 'file-loader', options: { name: 'pages/[name].[ext]' }, exclude: [/src/] },
    ],
  },
  plugins: [
    ...config.plugins || [],
    new DrupalTemplatePlugin({ ignore: /.*pages.*/ }),
  ],
});
