#!/usr/bin/env bash
set -e
set -x

mkdir -p dist/npm-package/
unlink dist/npm-package/package.json || true
ln -s `pwd`/src/package/package.json dist/npm-package/
