import {JspmCdnPlugin} from "@gongt/jspm";
import {RequestError} from "@gongt/ts-stl-library/request/request-error";
import {HtmlContainer} from "@gongt/ts-stl-server/express/middlewares/html-render";
import {provideWithExpress} from "@gongt/ts-stl-server/express/middlewares/well-known-provider";
import * as bodyParser from "body-parser";
import {Application} from "express";
import {resolve} from "path";
import * as serveStatic from "serve-static";
import {EUploadType, UploadService} from "../package";
import {passOptionsToPackage} from "../package/express";
import {INTERNAL_TESTING_PROJECT} from "../package/lib/options";
import {SERVER_ROOT} from "./boot";

const jspm = new JspmCdnPlugin({
	packageName: 'tester',
	packageJsonFile: resolve(SERVER_ROOT, 'package.json'),
});
const jspmConfig = jspm.jspmConfig();
jspm.clientCodeLocation(
	resolve(SERVER_ROOT, 'dist/client'),
	resolve(SERVER_ROOT, 'src/simple-test-pages'),
);
jspmConfig.registerExtension('css');

jspmConfig.manualRegisterModule('@gongt/file-upload-client', {
	'defaultExtension': 'js',
	'format': 'cjs',
	'main': 'index.js',
});
jspmConfig.pathMap('@gongt/file-upload-client', 'self-package');

jspm.addNodeModulesLayer(resolve(SERVER_ROOT, 'node_modules'));
if (!process.env.RUN_IN_DOCKER) {
	jspmConfig.registerNodeModules('@gongt/ts-stl-library');
	jspmConfig.registerNodeModules('@gongt/ts-stl-client');
}

export function createDebugPages(type: EUploadType, app: Application) {
	const client = new UploadService({
		projectName: INTERNAL_TESTING_PROJECT,
		type,
	});
	
	app.engine('ejs', require('ejs').renderFile);
	
	app.use('/public/self-package', serveStatic(resolve(SERVER_ROOT, 'dist/npm-package'), {
		fallthrough: false,
	}));
	
	const html = new HtmlContainer();
	html.plugin(jspm);
	html.stylesheet('https://ajax.aspnetcdn.com/ajax/bootstrap/3.3.7/css/bootstrap.min.css');
	html.addHead(`<style type="text/css">.panel-body > pre { margin: -15px }</style>`);
	provideWithExpress(app, jspm);
	
	app.get(`/test/${type}`, passOptionsToPackage(client), html.createMiddleware());
	
	app.post(`/test/${type}/hold`, bodyParser.json(), (req, res) => {
		const {fileId, holdName, holdId} = req.body;
		
		try {
			client.holdFile(fileId, holdId, holdName).then((data) => {
				res.send(Object.assign({status: 0}, data));
			}, (e) => {
				res.send({status: 1, message: e.message});
			});
		} catch (e) {
			res.send(RequestError.convert(e));
		}
	});
	app.post(`/test/${type}/release`, bodyParser.json(), (req, res) => {
		const {fileId, holdName, holdId} = req.body;
		
		try {
			client.releaseFile(fileId, holdId, holdName).then((data) => {
				res.send(Object.assign({status: 0}, data));
			}, (e) => {
				res.send({status: 1, message: e.message});
			});
		} catch (e) {
			res.send(RequestError.convert(e));
		}
	});
}
