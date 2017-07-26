import {bootExpressApp} from "@gongt/ts-stl-server/boot/express-init";
import {initServiceWait} from "@gongt/ts-stl-server/boot/init-systemd-service";
import {waitDatabaseToConnect} from "@gongt/ts-stl-server/database/mongodb";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import {router as ApiRouter} from "./api";
import {createDebugPages} from "./debug";

export const app: express.Application&any = express();

// logging request
//noinspection TypeScriptValidateTypes
app.use(logger(':method :url :status - :response-time ms'));

createDebugPages(app);

// enable cookies for pages, need to use before use router
app.use(cookieParser(JsonEnv.cookieKey));
// http method calls
app.use(bodyParser.json()); // TODO
app.use('/api', ApiRouter);
/*// app init complete */

const p = Promise.all([
	waitDatabaseToConnect(),
]).then(() => bootExpressApp(app));

initServiceWait(p);
