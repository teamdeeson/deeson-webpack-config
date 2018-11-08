#!/usr/bin/env bash

PHPCMD='./node_modules/.bin/deeson-router-start.sh'
WEBPACKCMD='./node_modules/deeson-webpack-config-starter/node_modules/.bin/webpack-dev-server'

if [ ! -f $WEBPACKCMD ]; then
  WEBPACKCMD='./node_modules/.bin/webpack-dev-server'
fi

if [ "${DOCKER_LOCAL}" != "1" ]; then
  PIDS=$(lsof -t -i tcp:3000 -i tcp:8080 -s tcp:LISTEN)
  CPIDS=$(echo $PIDS | tr " " ",")
  SPIDS=$(echo $PIDS | tr " " " ")

  if [[ ! -z $CPIDS ]]; then
    WD=$(lsof -a -p $CPIDS -d cwd -F n | grep '^n' | cut -c 2- | uniq)
    THIS="another"

    if [ $(pwd) == "$WD" ]; then
      THIS="this"
    fi

    echo -e "\033[93m\033[1mIt looks like you already have a frontend build going on in $THIS directory ($WD)."
    read -r -n 1 -p "We cant run two at once, would you like the other one stopped? [y/n] " response

    case $response in
      y)
        echo -e "\n.. stopping"
        kill -KILL $SPIDS
        ;;
      *)
        echo -e "\n.. cancelled"
        exit
        ;;
    esac

    echo -e "\033[0m"
  fi

  $PHPCMD &
  PHP=$!

  $WEBPACKCMD &
  WP=$!

  trap "kill -KILL $PHP $WP > /dev/null 2>&1" EXIT

  if ! lsof -t -p $PHP || ! lsof -t -p $WP; then
    echo -e '\033[1m\033[31mSomething failed to start, take a note of the errors above and give james a shout.\033[0m';
  else
    echo -e '\n\033[32m\033[1mEverything up and running at https://localhost:8080/<your page> -- Ctrl-C to quit\033[0m\n';
  fi

  wait $PHP $WP > /dev/null 2>&1

else
  $WEBPACKCMD
fi
