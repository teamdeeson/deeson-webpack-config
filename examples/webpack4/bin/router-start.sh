#!/usr/bin/env bash

if [ -n "$PHP_HOST" ]; then
  php -S "$PHP_HOST" ./bin/router.php
elif [ "$DOCKER_LOCAL" == "1" ]; then
  php -S 0.0.0.0:80 ./bin/router.php
else
  php -S 127.0.0.1:3000 ./bin/router.php
fi
