import {Metadata} from "aws-sdk/clients/s3";
import {createHash} from "crypto";
import {define as defineMimeType, getExtension} from "mime";
import {extname, resolve} from "path";

defineMimeType({
	'application/x-zip-compressed': ['zip'],
	'application/zip': ['zip'],
}, true);

export function getFileRelatedToRootPath(time: Date, fileKey: string) {
	return resolve('/',
		time.getUTCFullYear().toString(),
		(time.getUTCMonth() + 1).toString(),
		time.getUTCDate().toString(),
		fileKey,
	).replace(/^\//g, '');
}

export function createFileName(time: Date, fileHash: string, mime: string, metaData: Metadata = {}) {
	let extStr = getExtension(mime);
	
	if (!extStr) {
		return null;
	}
	
	if (extStr === 'bin' && metaData.originalFileName) {
		extStr = extname(metaData.originalFileName).replace(/^\./, '');
	}
	
	return `${md5(fileHash)}.${time.getUTCHours()}${time.getUTCMinutes()}${time.getUTCSeconds()}.${extStr}`
}

function md5(data) {
	return createHash('md5').update(data).digest("hex");
}
