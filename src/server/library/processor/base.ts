import {LOG_LEVEL} from "@gongt/ts-stl-library/log/levels";
import {createLogger} from "@gongt/ts-stl-server/debug";
import {FilePropertiesServer} from "../../../package/public-define";
import {MongoObj} from "../../database/base";
import {compareHash, hashBuffer} from "../helper/hash";

export abstract class FileProcessor<T extends FilePropertiesServer = FilePropertiesServer> {
	protected warn = createLogger(LOG_LEVEL.WARN, 'file-process');
	protected sill = createLogger(LOG_LEVEL.SILLY, 'file-process');
	protected props: MongoObj<T>;
	protected buffer: Buffer;
	
	constructor(object: MongoObj<T>, fileContent: Buffer) {
		this.props = object;
		this.buffer = fileContent;
	}
	
	protected checkHash() {
		if (!compareHash(this.props, hashBuffer(this.buffer))) {
			throw new Error('hash not same');
		}
	}
	
	abstract check(): Promise<any>;
}

export interface FileProcessorCreator {
	new(object: FilePropertiesServer, fileContent: Buffer): FileProcessor;
}
