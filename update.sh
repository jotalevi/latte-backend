#!/bin/sh

git pull
rm -r node_modules
npm i
npm run build
pm2 delete latte_BE
pm2 start dist/main.js --name latte_BE