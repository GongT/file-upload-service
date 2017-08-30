import {DocumentQuery, Schema, SchemaDefinition, SchemaTypes} from "mongoose";
import {FilePropertiesServer} from "../../package/public-define";
import {EBackendType} from "../library/backend";
import {ImageFileProcessor} from "../library/processor/image";
import {DatabaseOptions, UploadBase} from "./base";

export const UploadItemsSchema: SchemaDefinition = {};

interface KeyValuePair {
	[id: string]: string;
}

export class UploadImages extends UploadBase<FilePropertiesServer> {
	public readonly Processor = ImageFileProcessor;
	
	protected getStorageOptions(): DatabaseOptions {
		const config = JsonEnv.upload.image;
		if (!EBackendType.hasOwnProperty(config.type)) {
			throw new TypeError('unknown storage backend type: ' + config.type);
		}
		return {
			type: EBackendType[config.type],
			table: config.table,
			key: config.key,
			secret: config.secret,
			url: config.url,
			region: config.region,
			bucket: config.bucket,
		};
	}
	
	protected createSchemaExtra(): SchemaDefinition {
		return UploadItemsSchema;
	}
}
