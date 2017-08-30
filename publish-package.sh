#!/usr/bin/env bash

set -e
set -x

cd src/package/
ncu -a -u
cd ../..

unlink dist/npm-package/package.json || true
rm -rf dist/npm-package

tsc -p src/package
tsc -p src/package/tsconfig.es5.json

cp src/package/package.json dist/npm-package/package.json

cd dist/npm-package
npm publish
