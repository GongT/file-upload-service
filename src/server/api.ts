import {JsonApiHandler} from "@gongt/ts-stl-server/express/api-handler";
import {Router} from "express";
import {Router as CoreRouter} from "express-serve-static-core";
import {EUploadType} from "../package";
import {completeUploadApi} from "./api/complete-upload";
import {fetchFileApi} from "./api/fetch-file";
import {holdFileApi} from "./api/hold-file";
import {resizeImageApi} from "./api/image/resize";
import {releaseFileApi} from "./api/release-file";
import {signUploadUrlApi} from "./api/sign-upload-url";
import {UploadBase} from "./database/base";
import {switchDatabase} from "./database/switch-database";

export const ApiRouter: CoreRouter = Router();

function slashEnd(str) {
	return str.replace(/([^\/])$/, '$1/');
}

ApiRouter.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', req.header('Origin') || '*');
	res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
	res.header('Access-Control-Max-Age', '31536000');
	res.header('Access-Control-Allow-Methods', req.header('Access-Control-Request-Methods') || '*');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});
ApiRouter.options(/.*/, (req, res) => {
	res.sendStatus(200);
});

export interface ApiCreator {
	(model: UploadBase<any>): JsonApiHandler<any, any>;
}

const apiList: ApiCreator[] = [
	signUploadUrlApi,
	completeUploadApi,
	fetchFileApi,
	holdFileApi,
	releaseFileApi,
];
const processApiList: {[s: string]: ApiCreator[]} = {
	[EUploadType.image]: [
		resizeImageApi,
	],
	[EUploadType.file]: [],
};

for (let type of [EUploadType.image, EUploadType.file]) {
	const subRouter: CoreRouter = Router();
	
	const model = switchDatabase(type);
	for (const apiCreator of apiList) {
		apiCreator(model).registerRouter(subRouter)
	}
	for (const apiCreator of processApiList[type]) {
		apiCreator(model).registerRouter(subRouter)
	}
	
	ApiRouter.use('/' + type, subRouter);
}
