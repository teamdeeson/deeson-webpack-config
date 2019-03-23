#!/usr/bin/env bash

usage=`cat <<EOT

Usage: $0 -n componentName -a firstArgument -a secondArgument [-7 | -8]
EOT
`

count=0
args=()
name=""
ext=""
vardump=""
while getopts ":a:n:78" opt; do
  case $opt in
    7)
      ext=".tpl.php"
      vardump='<?php var_dump($content) ?>'
      ;;
    8)
      ext=".html.twig"
      vardump='{{ dump(content) }}'
      ;;
    n)
      name=$OPTARG
      ;;
    a)
      count=$(( $count + 1 ))
      args[count]=$OPTARG;
      ;;
    \?)
      cat <<EOT
Invalid option: -$OPTARG
  $usage
EOT
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

if [ ! $ext ]; then
  cat <<EOT
Must supply -7 or -8 depending on your drupal environment
  $usage
EOT
  exit 1;
fi


tplname=`echo $name | perl -ne 'print lc(join("-", split(/(?=[A-Z])/)))'`

if [ ! -f "./src/components/$name" ]; then
  mkdir -p "./src/components/$name"

  cat <<EOT > "./src/components/$name/$tplname$ext"
<div style="outline: 1px darkslategrey solid; padding: 0.5em; color: darkslategrey; background-color: mintcream;">
  <pre>
component: $name
arguments: ${args[*]}

provided \$content:
  </pre>
$vardump
</div>
EOT

  echo "import './components/$name';" >> ./src/app.js
  echo "import './$tplname$ext';" > ./src/components/$name/index.js

  exit 0;
else
  echo "Component directory already exists";
  exit 1;
fi

