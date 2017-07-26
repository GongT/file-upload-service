#!/usr/bin/env bash
set -e
set -x

mkdir -p dist/npm-package/
cd dist/npm-package
unlink package.json || true
ln -s ../../src/package/package.json
