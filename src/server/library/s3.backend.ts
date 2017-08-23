import {basename} from "path"
import {BackendOptions, SaveGenerateFileOptions, StorageBackend} from "server/library/backend";
import {resolve} from "url";
import {SaveResult, SignResult} from "../../package/public-define";
import AWS = require("aws-sdk");

export class S3Backend implements StorageBackend {
	private bucket: AWS.S3;
	private BUCKET: string;
	private BUCKET_DOMAIN: string;
	
	constructor(private options: BackendOptions) {
		this.BUCKET = this.options.bucket;
		this.BUCKET_DOMAIN = `https://${this.BUCKET}.s3.amazonaws.com`;
		
		AWS.config.update(<any>{
			accessKeyId: options.key,
			secretAccessKey: options.secret,
			region: options.region,
		});
		
		this.bucket = new AWS.S3();
	}
	
	signKey(fileType: string, key: string) {
		const s3Params = {
			Bucket: this.BUCKET,
			Key: key,
			Expires: 60,
			ContentType: fileType,
			ACL: 'public-read',
		};
		
		return new Promise((resolve, reject) => {
			const wrappedCallback = (err, data) => err? reject(err) : resolve(data);
			
			this.bucket.getSignedUrl('putObject', s3Params, wrappedCallback);
		}).then((data) => {
			return <SignResult>{
				uploadUrl: data,
				fetchUrl: resolve(this.BUCKET_DOMAIN, key),
				fetchUrlInternal: resolve(this.BUCKET_DOMAIN, key),
			};
		});
	}
	
	save(options: SaveGenerateFileOptions): Promise<SaveResult> {
		return this.bucket.upload({
			ACL: 'public-read',
			Body: options.buffer,
			Bucket: this.BUCKET,
			Metadata: options.meta,
			Key: options.fileName,
			ContentType: options.mimeType,
			Expires: options.expires,
			ContentDisposition: basename(options.fileName),
			ContentMD5: options.hash,
		}).promise().then((data) => {
			return {
				fetchUrl: resolve(this.BUCKET_DOMAIN, options.fileName),
				fetchUrlInternal: resolve(this.BUCKET_DOMAIN, options.fileName),
			};
		});
	}
}
