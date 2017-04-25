#!/bin/bash

if [  $# -le 1 ]
then
    echo Usage: $0 /dir/to/output /base/url/prefix
    exit 1
fi

PAGES=./pages/*
OUTDIR=$1
BASE_URL=$2

WEBPACKCMD='./node_modules/deeson-webpack-config-starter/node_modules/.bin/webpack'

if [ ! -f $WEBPACKCMD ]; then
  WEBPACKCMD='./node_modules/.bin/webpack'
fi

mkdir -p $OUTDIR;

for p in $PAGES; do
    fbname=$(basename "$p")
    >&2 echo Generating: $fbname
    php ./node_modules/.bin/deeson-router-php $p $BASE_URL > $OUTDIR/$fbname
done;

>&2 echo Running webpack...
$WEBPACKCMD --output-path=$OUTDIR/assets

echo Done. Pages are stored in $OUTDIR/ and should be accessed from yourdomain.example.com$BASE_URL
