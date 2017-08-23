import {S3} from "aws-sdk";
import {Metadata} from "aws-sdk/clients/s3";
import {SaveResult, SignResult} from "../../package/public-define";

// ALERT: key and value must same
export enum EBackendType {
	oss = 'oss',
	aws = 'aws',
}

export interface BackendOptions {
	url: string;
	region: string;
	key: string;
	secret: string;
	bucket: string;
}

export interface DriverOptions extends BackendOptions {
	type: EBackendType;
}

export interface SaveGenerateFileOptions {
	hash: string;
	fileName: string;
	buffer: Buffer;
	mimeType: string;
	meta?: Metadata;
	expires?: Date;
}

export interface StorageBackend {
	signKey(fileType: string, key: string): Promise<SignResult>;
	
	save(options: SaveGenerateFileOptions): Promise<SaveResult>;
}

export interface StorageBackendCreator {
	new(options: BackendOptions): StorageBackend;
}
