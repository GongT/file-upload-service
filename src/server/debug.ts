import {JspmCdnPlugin} from "@gongt/jspm";
import {HtmlContainer} from "@gongt/ts-stl-server/express/middlewares/html-render";
import {provideWithExpress} from "@gongt/ts-stl-server/express/middlewares/well-known-provider";
import {Application} from "express";
import {resolve} from "path";
import {SERVER_ROOT} from "./boot";
import serveStatic = require("serve-static");

const debug = require("debug");

export function createDebug(title) {
	return debug(`file-upload:${title}`);
}

export function createDebugPages(app: Application) {
	app.engine('ejs', require('ejs').renderFile);
	// requestUrl: CONFIG_BASE_DOMAIN,
	const jspm = new JspmCdnPlugin({
		packageName: 'tester',
		packageJsonFile: resolve(SERVER_ROOT, 'package.json'),
	});
	jspm.clientCodeLocation(
		resolve(SERVER_ROOT, 'dist/client'),
		resolve(SERVER_ROOT, 'src/simple-test-pages'),
	);
	jspm.jspmConfig().registerExtension('css');
	
	app.use('/public/self-package', serveStatic(resolve(SERVER_ROOT, 'dist/npm-package'), {
		fallthrough: false,
	}));
	
	const html = new HtmlContainer();
	html.addBody(`<div id="reactRoot"></div>`);
	html.plugin(jspm);
	html.stylesheet('https://ajax.aspnetcdn.com/ajax/bootstrap/3.3.7/css/bootstrap.min.css');
	html.addHead(`<style type="text/css">.panel-body > pre { margin: -15px }</style>`)
	provideWithExpress(app, jspm);
	
	app.get('/test', html.createMiddleware());
}
