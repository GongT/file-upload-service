import {awaitIterator} from "@gongt/ts-stl-library/pattern/await-iterator";
import {basename} from "path"
import {resolve} from "url";
import {SaveResult, SignResult} from "../../package/public-define";
import {BackendOptions, SaveGenerateFileOptions, StorageBackend} from "./backend";

const OSS = require('ali-oss');

export class OSSBackend implements StorageBackend {
	protected endpointUrlInternal: string;
	protected endpointUrl: string;
	protected signExpire = 60;
	private bucket: ali_oss;
	
	constructor(private options: BackendOptions) {
		this.endpointUrlInternal = this.options.url.replace(/^https:/, 'http:');
		this.endpointUrl = this.endpointUrlInternal
		                       .replace('-internal.aliyuncs.com', '.aliyuncs.com')
		                       .replace('vpc100-', '')
		                       .replace(/^http:/, 'https:');
		
		console.log('init aliyun cdn (oss)');
		console.log('url=%s', this.endpointUrl);
		console.log('internal url=%s', this.endpointUrlInternal);
		
		Object.assign(this.options, {
			internal: false,
			secure: !JsonEnv.isDebug,  // xxx
		});
		this.bucket = OSS({
			accessKeyId: this.options.key,
			accessKeySecret: this.options.secret,
			region: options.region,
			bucket: options.bucket,
		});
	}
	
	async signKey(fileType: string, key: string): Promise<SignResult> {
		const url = this.bucket.signatureUrl(key, {
			expires: this.signExpire,
			'content-type': fileType,
			method: 'PUT',
		});
		
		if (!url) {
			throw new Error('can not sign url. (empty return).');
		}
		
		return {
			uploadUrl: url,
			fetchUrl: resolve(this.endpointUrl, key),
			fetchUrlInternal: resolve(this.endpointUrlInternal, key),
		}
	}
	
	save(options: SaveGenerateFileOptions): Promise<SaveResult> {
		const headers = {
			'Content-MD5': options.hash,
			'Content-Disposition': basename(options.fileName),
			'Content-Length': options.buffer.length,
		};
		if (options.expires) {
			headers['Expires'] = options.expires.getTime() - Date.now();
		}
		
		const x: IterableIterator<any> = this.bucket.put(options.fileName, options.buffer, {
			mime: options.mimeType,
			meta: options.meta,
			headers,
		});
		
		return awaitIterator(x).then((data) => {
			return {
				fetchUrl: resolve(this.endpointUrl, options.fileName),
				fetchUrlInternal: resolve(this.endpointUrlInternal, options.fileName),
			};
		});
	}
}
