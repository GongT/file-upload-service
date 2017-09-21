import {createHash} from "crypto";
import {define as defineMimeType, getExtension} from "mime";
import {resolve} from "path";

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

export function createFileName(time: Date, fileHash: string, mime: string) {
	const extStr = getExtension(mime);
	
	if (!extStr) {
		return null;
	}
	
	return `${md5(fileHash)}.${time.getUTCHours()}${time.getUTCMinutes()}${time.getUTCSeconds()}.${extStr}`
}

function md5(data) {
	return createHash('md5').update(data).digest("hex");
}
