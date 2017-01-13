'use strict';

const path = require('path');
const RawSource = require('webpack-sources').RawSource;

function DrupalHookThemeTemplatesPlugin(options) {
}

DrupalHookThemeTemplatesPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {

    const tpls = [];
    const twigs = [];

    compilation.modules.forEach(function(module) {
      if (module.resource) {
        const file = path.basename(module.resource);
        const template = file.replace(/\.(tpl\.php|html\.twig)$/, "");
        const name = template.replace(/-/, "_");

        if (module.resource.match(/(tpl\.php)$/)) {
          tpls.push({template, name});
        }

        if (module.resource.match(/(html\.twig)$/)) {
          twigs.push({template, name});
        }
      }
    });

    const entry = t => `"${t.name}" => ["template" => "${t.template}", "path" => $assetPath . "/components", "variables" => ["content" => []] ]`;
    const strungTpls = tpls.map(entry);
    const strungTwigs = twigs.map(entry);

    compilation.assets['component-templates.php'] = new RawSource(
      `<?php /* Generated file, dont monkey. */
function deeson_tpl_component_templates($assetPath = NULL) {
  if (!$assetPath) {
    $assetPath = str_replace(DRUPAL_ROOT, '', dirname(__FILE__));
  }
  return [ ${strungTpls.join(', ')} ];
}

function deeson_twig_component_templates($assetPath = NULL) {
  if (!$assetPath) {
    $assetPath = str_replace(DRUPAL_ROOT, '', dirname(__FILE__));
  }
  return [ ${strungTwigs.join(', ')} ];
}`
    );

    callback();
  });
};

module.exports = DrupalHookThemeTemplatesPlugin;
