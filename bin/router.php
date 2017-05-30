<?php
$sapi = php_sapi_name();

if ($sapi === 'cli') {
  $docroot = getcwd() . '/';
  $page = $argv[1];
  $baseUrl = isset($argv[2]) ? $argv[2] : "/";
}
else {
  $docroot = $_SERVER['DOCUMENT_ROOT'];
  $page = $_SERVER['REQUEST_URI'];
  $baseUrl = '/';

  if (is_dir($docroot . $page)) {
    // Issue a redirect rather than rewrite because other servers won't assume
    // index.twig.html is an index file and we don't want to encourage
    // <a href="/"… in page files.
    $indexes = ['/index.twig.html', '/index.php.html'];
    foreach ($indexes as $index) {
      if (file_exists($docroot . $page . $index)) {
        $page = rtrim($page, '/');
        http_response_code(302);
        header("location: $page$index");
        exit;
      }
    }
  }

  if (!is_file($docroot . $page)) {
    http_response_code(404);
    print '<h1>404 Not Found</h1>';
    exit;
  }
}

if (preg_match('/\.twig(\.html)?$/', $page)) {
  require_once './vendor/autoload.php';

  $loader = new Twig_Loader_Filesystem('./pages/');
  $loader->addPath('./assets/components', 'components');
  $twig = new Twig_Environment($loader, [
    'debug' => true,
    'autoescape' => false,
  ]);
  $twig->addExtension(new Twig_Extension_Debug());

  $twig->addFilter(new Twig_Filter('*', function($name, $input) {
    return $input;
  }));

  echo $twig->render(basename($docroot . $page), [
    'directory' => '',
    'base_path' => rtrim($baseUrl, '/'),
  ]);
}
elseif (preg_match('/\.php(\.html)?$/', $page)) {
  function render($t) { return $t; }
  function url($t) { return $t; }
  function theme($n, $content = ['content'=>[]]) {
    $name = str_replace('_', '-', $n);

    $directory = new RecursiveDirectoryIterator($_SERVER['DOCUMENT_ROOT'] . '/src/components/');
    $iterator = new RecursiveIteratorIterator($directory);
    $regex = new RegexIterator($iterator, '/.*\/' . $name . '\.tpl.php$/i', RecursiveRegexIterator::GET_MATCH);
    $files = iterator_to_array($regex);

    if (empty($files)) {
      return "<pre style='background-color: #e2e2e2; padding: 0.5em; color: #666'>missing component template '$n'</pre>";
    }
    elseif (count($files) > 1) {
      $r = "<pre style='background-color: #e2e2e2; padding: 0.5em; color: #666'>multiple matches for component template '$n', there can be only one.\n";
      foreach ($files as $k => $v) {
        $r .= $k . "\n";
      }
      return $r . '</pre>';
    }
    else {
      $files = array_keys($files);
      $file = array_pop($files);
    }

    return theme_render_template($file, [
      'content' => $content['content'],
    ]);
  }

  function theme_render_template($file, $variables = []) {
    $variables += [
      'directory' => '',
      'base_path' => rtrim($GLOBALS['baseUrl'], '/'),
    ];
    ob_start();
    extract($variables, EXTR_SKIP);
    include $file;
    return ob_get_clean();
  }

  echo theme_render_template(ltrim($page, '/'));
}
else {
  return FALSE;
}
