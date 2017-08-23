#!/usr/bin/env bash

ncu -a -u
cd src/package
ncu -a -u

echo "
Object.keys(require('./package.json').devDependencies)
	.filter((n) => {
		return n.indexOf('@types/') === 0;
	})
	.forEach((x) => console.log(x));
" | node | xargs --no-run-if-empty npm install

