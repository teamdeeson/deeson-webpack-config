<?php
$sapi = php_sapi_name();

if ($sapi === 'cli') {
  $_SERVER['DOCUMENT_ROOT'] = getcwd() . '/';
}

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

  $twig->addFilter(new Twig_Filter('*', function($name, $input) {
    return $input;
  }));

  echo $twig->render(basename($_SERVER['SCRIPT_FILENAME']));
} else {
  function render($t) { return $t; }
  function theme($n, $content = ['content'=>[]]) {
    $name = str_replace('_', '-', $n);

    $directory = new RecursiveDirectoryIterator($_SERVER['DOCUMENT_ROOT'] . '/src/components/');
    $iterator = new RecursiveIteratorIterator($directory);
    $regex = new RegexIterator($iterator, '/.*\/' . $name . '\.tpl.php$/i', RecursiveRegexIterator::GET_MATCH);
    $files = iterator_to_array($regex);

    if (empty($files)) {
      return "<pre style='background-color: #e2e2e2; padding: 0.5em; color: #666'>missing component template '$n'</pre>";
    } else if (count($files) > 1) {
      $r = "<pre style='background-color: #e2e2e2; padding: 0.5em; color: #666'>multiple matches for component template '$n', there can be only one.\n";
      foreach ($files as $k => $v) {
        $r .= $k . "\n";
      }
      return $r . '</pre>';
    } else {
      $files = array_keys($files);
      $file = array_pop($files);
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
