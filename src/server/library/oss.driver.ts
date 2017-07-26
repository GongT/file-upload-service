import {resolve} from "url";
import {SignResult} from "../../package/public-define";
import {DriverBase} from "./base.driver";

let OSS;
let bucket: ali_oss;
const endpointUrlInternal = JsonEnv.upload.file.cdn.url
                                   .replace(/^https:/, 'http:');
const endpointUrl = endpointUrlInternal
	.replace('-internal.aliyuncs.com', '.aliyuncs.com')
	.replace('vpc100-', '')
	.replace(/^http:/, 'https:');

console.log('init aliyun cdn (oss)');
console.log('url=%s', endpointUrl);
console.log('internal url=%s', endpointUrlInternal);

export class OSSDriver extends DriverBase {
	constructor() {
		super();
		
		OSS = require('ali-oss');
		const opts = Object.assign({}, JsonEnv.upload.file.cdn, {
			internal: false,
			secure: !JsonEnv.isDebug,  // xxx
		});
		
		console.log('create aliyun cdn (oss) driver: ', opts);
		bucket = OSS(opts);
	}
	
	signKey(fileType: string, key: string): Promise<any> {
		const url = bucket.signatureUrl(key, {
			expires: this.signExpire,
			'content-type': fileType,
			method: 'PUT',
		});
		
		if (!url) {
			return Promise.reject(new Error('can not sign url. (empty return).'))
		}
		
		return Promise.resolve(<SignResult>{
			uploadUrl: url,
			fetchUrl: resolve(endpointUrl, key),
			fetchUrlInternal: resolve(endpointUrlInternal, key),
		});
	}
}
