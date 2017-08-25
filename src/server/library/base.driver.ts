import {createLogger} from "@gongt/ts-stl-library/log/debug";
import {LOG_LEVEL} from "@gongt/ts-stl-server/log/levels";
import {FileProperties, SaveResult, SignResult} from "../../package/public-define";
import {createFileName, getFileRelatedToRootPath} from "../database/generate-key";
import {DriverOptions, SaveGenerateFileOptions, StorageBackend} from "./backend";
import {getBackend} from "./get-backend";
import {downloadFile} from "./helper/request";

const debug = createLogger(LOG_LEVEL.DEBUG, 'driver');

export class DiedFileError extends Error {
}

export class StorageDriver {
	protected backend: StorageBackend;
	protected readonly options: DriverOptions;
	
	constructor(options: DriverOptions) {
		debug('create %s -> %s driver', options.type, options.bucket);
		this.options = options;
		this.backend = getBackend(options.type, options);
	}
	
	sign(object: FileProperties): Promise<SignResult> {
		const key = createFileName(object.createdAt, object.fileHash, object.mime);
		if (!key) {
			throw new Error('not support file type: ' + object.mime + ', please compress them.');
		}
		const filePath = getFileRelatedToRootPath(object.createdAt, key);
		return this.backend.signKey(object.mime, filePath);
	}
	
	download(object: FileProperties): Promise<Buffer> {
		if (!object.urlInternal) {
			// file object not even created
			return null;
		}
		return downloadFile(object);
	}
	
	async saveGernerated(options: SaveGenerateFileOptions): Promise<SaveResult> {
		return this.backend.save(options);
	}
}
