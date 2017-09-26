import {DataModel, TypedDocument} from "@gongt/ts-stl-server/database/mongodb";
import {
	Connection,
	createConnection,
	DocumentQuery,
	Model,
	ModelFindByIdAndUpdateOptions,
	ModelFindOneAndUpdateOptions,
	ModelUpdateOptions,
	Schema,
	SchemaDefinition,
	SchemaOptions,
	SchemaTypes,
	Types,
} from "mongoose";
import {DriverOptions} from "server/library/backend";
import {FileProcessorCreator} from "server/library/processor/base";
import {KeyValuePair} from "../../package";
import {FilePropertiesServer, IHolder} from "../../package/public-define";
import {StorageDriver} from "../library/base.driver";

export type MongoObj<T> = T&TypedDocument<T>;

const holderSchema = new Schema({
	holder: String,
	relatedId: String,
}, {_id: false});
export const UploadItemsSchema: SchemaDefinition = {
	url: {
		type: String,
		required: true,
	},
	urlInternal: {
		type: String,
		required: true,
	},
	mime: {
		type: String,
	},
	fileHash: {
		type: String,
		required: true,
		unique: true,
	},
	hasUploaded: {
		type: Boolean,
		default: false,
	},
	error: {
		type: SchemaTypes.Mixed,
		required: false,
	},
	holders: {
		type: [holderSchema],
		default: [],
	},
	attachedData: {
		type: Object,
		required: true,
	},
};

export interface DatabaseOptions extends DriverOptions {
	table: string;
}

export abstract class UploadBase<ExtraProps extends FilePropertiesServer> extends DataModel<MongoObj<ExtraProps>> {
	public readonly abstract Processor: FileProcessorCreator;
	public readonly storage: StorageDriver;
	
	constructor(database?: Connection) {
		super(database);
		this.storage = new StorageDriver(this.getStorageOptions());
	}
	
	protected abstract getStorageOptions(): DatabaseOptions;
	
	protected abstract createSchemaExtra(): SchemaDefinition;
	
	protected createSchema(): SchemaDefinition {
		return Object.assign({}, UploadItemsSchema, this.createSchemaExtra());
	}
	
	protected get tableName() {
		return this.getStorageOptions().table;
	}
	
	protected wrapMeta(meta: KeyValuePair) {
		const wrappedMeta = {};
		Object.keys(meta).forEach((name) => {
			wrappedMeta[`attachedData.${name}`] = meta[name];
		});
		return wrappedMeta;
	}
	
	async checkExistsByHash(hash: string, upsert?: KeyValuePair, meta?: KeyValuePair) {
		this.sill('fetch file with hash: %s', hash);
		
		let hasMeta = meta && Object.keys(meta).length > 0;
		
		let object: MongoObj<ExtraProps>;
		
		if (upsert) {
			object = await this.findOneAndUpdate({fileHash: hash}, {
				$setOnInsert: upsert,
				$set: hasMeta? this.wrapMeta(meta) : {attachedData: {}},
			}, {
				upsert: true,
				'new': true,
				setDefaultsOnInsert: true,
			});
			if (!object.hasUploaded && upsert.mime && object.mime !== upsert.mime) {
				object = await this.findOneAndUpdate({_id: object._id}, {$set: upsert}, {'new': true});
			}
		} else {
			object = await this.findOne({fileHash: hash});
		}
		
		if (!object) {
			throw new Error('Database Error: upload-items ::upsert() failed. without error.');
		}
		return object;
	}
	
	async getFileBuffer(object: MongoObj<ExtraProps>): Promise<Buffer> {
		if (object.hasUploaded) {
			return await this.storage.download(object);
		} else {
			this.sill('file not complete upload... checking...');
			const readyBuff = await this.storage.download(object);
			if (!readyBuff) {
				this.sill('file can\'t fetch, wait for next time.');
				throw new Error('file not uploaded');
			}
			
			const processor = new this.Processor(object, readyBuff);
			const checkPass = await processor.check();
			if (!checkPass) {
				this.sill('file wrong, may retry.');
				throw new Error('file content wrong');
			}
			
			this.sill('file status ok, mark file is upload complete.');
			
			object.set('hasUploaded', true);
			object.set('error', null);
			
			await object.save();
			
			return readyBuff;
		}
	}
	
	async createProcessor(id: string) {
		const object = await this.getById(id);
		const buffer = await this.getFileBuffer(object);
		return new this.Processor(object, buffer);
	}
	
	async checkUploadedFile(object: MongoObj<ExtraProps>, cache: boolean = true): Promise<MongoObj<ExtraProps>> {
		if (!object) {
			throw new Error('object not found');
		}
		if (cache && object.hasUploaded) {
			this.sill('file exists and upload completed.');
			return object;
		}
		this.sill('got file object, but not know is uploaded or not.');
		
		await this.getFileBuffer(object);
		return object;
	}
	
	hold(isHold: boolean, id: string, {holder, relatedId}: IHolder): Promise<any> {
		const update: any = {};
		if (isHold) {
			update.$addToSet = {
				holders: {holder, relatedId},
			};
		} else {
			update.$pull = {
				holders: {holder, relatedId},
			};
		}
		return this.update({_id: id}, update);
	}
}
