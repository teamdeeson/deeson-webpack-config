#!/bin/bash

WEBPACKCMD='./node_modules/deeson-webpack-config-starter/node_modules/.bin/webpack-dev-server'

if [ ! -f $WEBPACKCMD ]; then
  WEBPACKCMD='./node_modules/.bin/webpack-dev-server'
fi

WEBPACKCMD="${WEBPACKCMD}"

$WEBPACKCMD &
WP=$!

echo -e '\n\033[32m\033[1mEverything up and running at http://frontend.localhost/webpack-dev-server -- Ctrl-C to quit\033[0m\n';

wait $WP > /dev/null 2>&1
