import {GlobalVariable} from "@gongt/ts-stl-library/pattern/global-page-data";
import {Handler, NextFunction, Request, Response} from "express-serve-static-core";
import {FileUploadPassingVar, UploadService} from "./";

export function passOptionsToPackage(uploader: UploadService): Handler {
	return function (req: Request, res: Response, next: NextFunction) {
		const g = new GlobalVariable(res);
		g.set(FileUploadPassingVar, uploader.passToClient());
		next();
	};
}
