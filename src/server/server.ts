import {TranslateService} from "@gongt/i18n-client";
import {I18nExpress} from "@gongt/i18n-client/express";
import {bootExpressApp} from "@gongt/ts-stl-server/boot/express-init";
import {initServiceWait} from "@gongt/ts-stl-server/boot/init-systemd-service";
import {waitDatabaseToConnect} from "@gongt/ts-stl-server/database/mongodb";
import {provideWithExpress} from "@gongt/ts-stl-server/express/middlewares/well-known-provider";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import {EUploadType} from "../package";
import {ApiRouter} from "./api";
import {createDebugPages} from "./debug";

export const app: express.Application&any = express();

// enable cookies for pages, need to use before use router
app.use(cookieParser(JsonEnv.cookieKey));

// translator
const i18n = (new TranslateService({})).instance('file-upload');
const i18nExp = new I18nExpress(i18n, {
	app: {
		ignoreRoutes: ['/public'],
	},
});
provideWithExpress(app, i18nExp);

// logging request
app.use(logger(':method :url :status - :response-time ms'));

createDebugPages(EUploadType.file, app);
createDebugPages(EUploadType.image, app);
app.get('/test', (req, res) => {
	res.send(`<h1>${req.t('text message.test upload')}</h1>
<div style="font-size:x-large">
	<p><a href="/test/${EUploadType.file}">${req.t('link.' + EUploadType.file)}</a></p>
	<p><a href="/test/${EUploadType.image}">${req.t('link.' + EUploadType.image)}</a></p>
</div>
`);
});

// http method calls
app.use(bodyParser.json()); // TODO
app.use('/api', ApiRouter);
/*// app init complete */

const p = Promise.all([
	waitDatabaseToConnect(),
	i18n.wait,
]).then(() => bootExpressApp(app));

initServiceWait(p);
