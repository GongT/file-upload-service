import {DriverBase} from "./base.driver";
import {S3Driver} from "./s3.driver";
import {OSSDriver} from "./oss.driver";

let Construct;
switch (JsonEnv.upload.file.cdn.type) {
case 'oss':
	Construct = OSSDriver;
	break;
case 'aws':
	Construct = S3Driver;
	break;
default:
	throw new Error(`unknown cdn type: ${JsonEnv.upload.file.cdn.type}`);
}

export const driver: DriverBase = new Construct;
