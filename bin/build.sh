#!/bin/bash

if [  $# -le 1 ]
then
    echo Usage: $0 /dir/to/output /base/url/prefix
    exit 1
fi

PAGES=`find ./pages/ -type f`
DIRS=`find ./pages/ -type d`
OUTDIR=$1
BASE_URL=$2

WEBPACKCMD='./node_modules/deeson-webpack-config-starter/node_modules/.bin/webpack'

if [ ! -f $WEBPACKCMD ]; then
  WEBPACKCMD='./node_modules/.bin/webpack'
fi

mkdir -p $OUTDIR;

for d in $DIRS; do
  [ -d $OUTDIR/${d#./pages/} ] || mkdir -p $OUTDIR/${d#./pages/}
done;

for p in $PAGES; do
    if [[ $p =~ .*php$ || $p =~ .*twig$ ]]; then
      >&2 echo -e "\033[0;31mNot generating $p, you need to make it end in .html ($p.html)\033[0;0m"
    else
      >&2 echo -e "\033[0;32mGenerating: $p\033[0;0m"
      php ./node_modules/.bin/deeson-router-php $p $BASE_URL > $OUTDIR/${p#./pages/}
    fi
done;

>&2 echo Running webpack...
$WEBPACKCMD --output-path=$OUTDIR/assets/ --output-public-path=$BASE_URL/assets/

echo Done. Pages are stored in $OUTDIR/ and should be accessed from yourdomain.example.com$BASE_URL
