```
todo:

install instructions.


notes:

d7 - 
sites/all/themes/mytheme/template.php :

require_once dirname(__FILE__) . '/assets/component-templates.php';

function spitfire_theme() {
  return deeson_tpl_component_templates();
}


d8 - 
themes/mytheme/mytheme.theme : 

require_once __DIR__ . '/assets/component-templates.php';
function sn_theme_theme() {
  return deeson_twig_component_templates();
}

install drupal/components and :

themes/mytheme/mytheme.info.yml :

component-libraries:
  components:
    paths:
      - assets/components

```