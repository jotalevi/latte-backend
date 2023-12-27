#!/bin/sh

git pull
rm src/utils/ScrapeCache/filemap.json
npm i
npm run build
pm2 delete latte_BE
pm2 save
pm2 start dist/main.js --name latte_BE
pm2 save