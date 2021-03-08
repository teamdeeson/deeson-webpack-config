/* eslint no-param-reassign: ["error", { "props": false }] */

const path = require('path');
const RawSource = require('webpack-sources').RawSource;
const { sources, Complilation } = require("webpack");
const ID = 'deeson:tpls';

class DrupalHookThemeTemplatesPlugin {
  constructor(options = {}) {
    this.ignoreRegex = options.ignore || /[^.*]/;
  }

  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.compilation.tap(ID, compilation => {

      compilation.hooks.processAssets.tap(
        {name: 'DrupalHookThemeTemplatesPlugin', stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS },
         (assets) => {
        const tpls = [];
        const twigs = [];
    
        Object.keys(assets).forEach((k) => {
          if (this.ignoreRegex.test(k)) delete assets[k];
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
        const exists = compilation.getAsset('component-templates.php');

        if (strungTwigs.length || strungTpls.length) {
          const source = new sources.RawSource(
            `<?php /* Generated file, dont monkey. */
function deeson_tpl_component_templates($assetPath = '${assetPath}') {
  return [ ${strungTpls.join(', ')}
  ];
}

function deeson_twig_component_templates($assetPath = '${assetPath}') {
  return [ ${strungTwigs.join(', ')}
  ];
}`); 
          if (!exists) {
            compilation.emitAsset('component-templates.php', source);
          }
          else {
            compilation.updateAsset('component-templates.php', source);
          }
        }
      });
    });
  }
}


module.exports = DrupalHookThemeTemplatesPlugin;
