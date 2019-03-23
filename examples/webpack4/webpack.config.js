const config = require('deeson-webpack-config-starter');

// this should be the real asset path in drupal
// so something like /sites/all/themes/blah_blah/assets
config.output.publicPath = '/assets/';

// this is how you get auto reload happening
// for your pages without adding them to ./src/app.js
config.entry.pages = './pages/index.js';

module.exports = config;
