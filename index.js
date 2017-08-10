
const { flow } = require('lodash');

process.noDeprecation = true;

const makeConfig = flow(
  require('./src/defaults'),
  require('./src/js'),
  require('./src/dev'),
  require('./src/styles'),
  require('./src/drupal'),
  require('./src/fonts'),
);

module.exports = makeConfig({});
