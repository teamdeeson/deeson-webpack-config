/* eslint no-param-reassign: ["error", { "props": false }] */

const path = require('path');
const RawSource = require('webpack-sources').RawSource;

function DrupalHookThemeTemplatesPlugin(options = {}) {
  this.ignoreRegex = options.ignore || /[^.*]/;
}

DrupalHookThemeTemplatesPlugin.prototype.apply = function apply(compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    const tpls = [];
    const twigs = [];

    Object.keys(compilation.assets).forEach((k) => {
      if (this.ignoreRegex.test(k)) delete compilation.assets[k];
    });

    compilation.modules.forEach((module) => {
      if (module.resource && !this.ignoreRegex.test(module.resource)) {
        const file = path.basename(module.resource);
        const cpath = path.dirname(module.resource.replace(/.*\/src\//, '/'));
        const template = file.replace(/\.(tpl\.php|html\.twig)$/, '');
        const name = template.replace(/-/g, '_');

        if (module.resource.match(/(tpl\.php)$/)) {
          tpls.push({ template, name, cpath });
        }

        if (module.resource.match(/(html\.twig)$/)) {
          twigs.push({ template, name, cpath });
        }
      }
    });

    const entry = t => `
    "${t.name}" => [
      "template" => "${t.template}",
      "path" => $assetPath . "${t.cpath}",
      "variables" => ["content" => []]
    ]`;
    const strungTpls = tpls.map(entry);
    const strungTwigs = twigs.map(entry);
    const assetPath = compiler.options.output.publicPath.replace(/^\/(.*)\/$/, '$1');

    compilation.assets['component-templates.php'] = new RawSource(
      `<?php /* Generated file, dont monkey. */
function deeson_tpl_component_templates($assetPath = '${assetPath}') {
  return [ ${strungTpls.join(', ')}
  ];
}

function deeson_twig_component_templates($assetPath = '${assetPath}') {
  return [ ${strungTwigs.join(', ')}
  ];
}`);

    callback();
  });
};

module.exports = DrupalHookThemeTemplatesPlugin;
