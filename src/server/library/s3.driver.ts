import * as AWS from "aws-sdk";
import {resolve} from "url";
import {SignResult} from "../../package/public-define";
import {DriverBase} from "./base.driver";

let s3;

const BUCKET = JsonEnv.upload.file.cdn.bucket;
const BUCKET_DOMAIN = `https://${BUCKET}.s3.amazonaws.com`;

export class S3Driver extends DriverBase {
	constructor() {
		super();
		
		//noinspection TypeScriptUnresolvedFunction
		AWS.config.update(
			JsonEnv.upload.file.cdn,
		);
		
		s3 = new AWS.S3();
		
		console.log('created amazon cdn (aws-s3) driver');
	}
	
	signKey(fileType: string, key: string) {
		const s3Params = {
			Bucket: BUCKET,
			Key: key,
			Expires: 60,
			ContentType: fileType,
			ACL: 'public-read',
		};
		
		return new Promise((resolve, reject) => {
			const wrappedCallback = (err, data) => err? reject(err) : resolve(data);
			
			s3.getSignedUrl('putObject', s3Params, wrappedCallback);
		}).then((data) => {
			return <SignResult>{
				uploadUrl: data,
				fetchUrl: resolve(BUCKET_DOMAIN, key),
				fetchUrlInternal: resolve(BUCKET_DOMAIN, key),
			};
		});
	}
}
