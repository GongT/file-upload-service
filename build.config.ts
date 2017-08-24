/// <reference path="./.jsonenv/_current_result.json.d.ts"/>
import {JsonEnv} from "@gongt/jenv-data";
import {EPlugins, MicroBuildConfig} from "./.micro-build/x/microbuild-config";
import {MicroBuildHelper} from "./.micro-build/x/microbuild-helper";
declare const build: MicroBuildConfig;
declare const helper: MicroBuildHelper;
/*
 +==================================+
 |  **DON'T EDIT ABOVE THIS LINE**  |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

const projectName = 'file-upload';

build.baseImage('node', 'alpine');
build.projectName(projectName);
build.domainName(projectName + '.' + JsonEnv.baseDomainName);

build.systemd({
	type: 'notify',
	watchdog: 10,
});

build.forceLocalDns();
build.isInChina(JsonEnv.gfw.isInChina, JsonEnv.gfw);
build.npmCacheLayer(JsonEnv.gfw.npmRegistry);
build.npmInstall('./package.json', ['vips-dev', 'python', 'make', 'g++']);
build.github(JsonEnv.gfw.github);

build.forwardPort(80);
build.listenPort(JsonEnv.upload.file.debugPort);

build.startupCommand('dist/server/boot.js');
build.shellCommand('node');
// build.stopCommand('stop.sh');

build.addPlugin(EPlugins.jenv);

build.addPlugin(EPlugins.typescript, {
	source: 'src/package',
	target: 'dist/npm-package',
});
build.addPlugin(EPlugins.typescript, {
	source: 'src/server',
	target: 'dist',
});
build.addPlugin(EPlugins.typescript, {
	source: 'src/simple-test-pages',
	target: 'dist/client',
});

build.onConfig((isBuild) => {
	if (!isBuild) {
		const r = require('child_process').spawnSync('sh', ['pre-start.sh'], {
			stdio: 'inherit',
			cwd: __dirname,
		});
		if (r.error) {
			throw r.error;
		}
		if (r.status !== 0) {
			process.exit(r.status);
		}
	}
});
