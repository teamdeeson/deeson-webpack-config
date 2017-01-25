<?php

if (preg_match('/\.(?:twig)$/', $_SERVER["REQUEST_URI"])) {
  require_once './vendor/autoload.php';

  $loader = new Twig_Loader_Filesystem('./pages/');
  $loader->addPath('./assets/components', 'components');
  $twig = new Twig_Environment($loader, [
    'debug' => true
  ]);
  $twig->addExtension(new Twig_Extension_Debug());

  echo $twig->render(basename($_SERVER['SCRIPT_FILENAME']));
} else {
  function render($t) { return $t; }
  function theme($n, $content) {
    ob_start();

    $content = $content['content'];
    $path = str_replace(' ', '', lcfirst(ucwords(str_replace('_', ' ', $n))));
    $name = str_replace('_', '-', $n);
    include '../src/components/'.$path.'/'.$name.'.tpl.php';

    $out = ob_get_contents();
    ob_end_clean();

    return $out;
  }
  return false;
}
