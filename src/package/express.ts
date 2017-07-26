import {JsonEnv} from "@gongt/jenv-data";
import {GlobalVariable} from "@gongt/ts-stl-library/pattern/global-page-data";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {FileUploadPassingVar} from "./";

let url = JsonEnv.upload['apiEndPoint'] || '//image-upload.' + JsonEnv.baseDomainName;
if (!url) {
	throw new Error('can not detect image-upload url.');
}
url = url.replace(/^https?:/, '');

export function jsonEnvPassOptionsToPackage(req: Request, res: Response, next: NextFunction) {
	const g = new GlobalVariable(res);
	g.set(FileUploadPassingVar, url);
	next();
}
