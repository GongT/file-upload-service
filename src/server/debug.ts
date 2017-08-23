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
import {SERVER_ROOT} from "./boot";

const jspm = new JspmCdnPlugin({
	packageName: 'tester',
	packageJsonFile: resolve(SERVER_ROOT, 'package.json'),
});
jspm.clientCodeLocation(
	resolve(SERVER_ROOT, 'dist/client'),
	resolve(SERVER_ROOT, 'src/simple-test-pages'),
);
jspm.jspmConfig().registerExtension('css');

jspm.jspmConfig().registerNodeModules('@gongt/ts-stl-library');
jspm.jspmConfig().registerNodeModules('@gongt/ts-stl-client');

export function createDebugPages(type: EUploadType, app: Application) {
	const client = new UploadService({
		projectName: 'self-test',
		serverUrl: 'http://127.0.0.1:' + process.env.LISTEN_PORT + '/',
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
