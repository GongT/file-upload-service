import {FileProperties, SignResult} from "../../package/public-define";
import {createFileName, getFileRelatedToRootPath} from "../database/generate-key";
import {createDebug} from "../debug";
import {compareHash, hashBuffer} from "./helper/hash";
import {downloadFile} from "./helper/request";
import request = require("request");

const debugCheck = createDebug('hash-check');

export class DiedFileError extends Error {
}

export abstract class DriverBase {
	abstract signKey(fileType: string, key: string): Promise<SignResult>;
	
	protected signExpire = 60;
	
	constructor() {
	}
	
	sign(object: FileProperties): Promise<SignResult> {
		const key = createFileName(object.createdAt, object.fileHash, object.mime);
		if (!key) {
			throw new Error('not support file type: ' + object.mime + ', please compress them.');
		}
		const filePath = getFileRelatedToRootPath(object.createdAt, key);
		return this.signKey(object.mime, filePath);
	}
	
	isFileReady(object: FileProperties): Promise<boolean> {
		if (!object.urlInternal) {
			// file object not even created
			return Promise.resolve(false);
		}
		
		return downloadFile(object).then((gotBody) => {
			if (!gotBody) {
				return <any>false;
			}
			
			if (!compareHash(object, hashBuffer(<Buffer>gotBody))) {
				throw new DiedFileError('uploaded file hash failed.');
			}
			
			return true;
		});
	}
}
