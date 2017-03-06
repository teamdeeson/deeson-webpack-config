<?php

if (!file_exists($_SERVER['DOCUMENT_ROOT'] . $_SERVER['REQUEST_URI'])) {
  header("HTTP/1.0 404 Not Found");
  print '<h1>404 Not Found</h1>';
  exit;
}

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
  function theme($n, $content = ['content'=>[]]) {
    $path = str_replace(' ', '', lcfirst(ucwords(str_replace('_', ' ', $n))));
    $name = str_replace('_', '-', $n);
    $file = $_SERVER['DOCUMENT_ROOT'] . '/src/components/'.$path.'/'.$name.'.tpl.php';

    if (!file_exists($file)) {
      return "<pre style='background-color: #e2e2e2; padding: 0.5em; color: #666'>missing component template '$n'</pre>";
    }

    ob_start();

    $content = $content['content'];
    include $file;

    $out = ob_get_contents();
    ob_end_clean();

    return $out;
  }
  return false;
}
