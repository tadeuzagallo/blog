#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# hack to unregister service worker for old blog
cp service-worker.js dist

# navigate into the build output directory
cd dist

touch .nojekyll

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:tadeuzagallo/blog.git main:gh-pages

cd -
