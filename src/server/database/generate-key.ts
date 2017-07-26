import {createHash} from "crypto";
import {define as defineMimeType, extension} from "mime";
import {resolve} from "path";

const ROOT_FOLDER = JsonEnv.upload.file.rootFolder.replace(/^\//g, '');

defineMimeType({
	'application/x-zip-compressed': ['zip'],
});

export function getFileRelatedToRootPath(time: Date, fileKey: string) {
	return resolve('/', ROOT_FOLDER,
		time.getUTCFullYear().toString(),
		(time.getUTCMonth() + 1).toString(),
		time.getUTCDate().toString(),
		fileKey).replace(/^\//g, '');
}

export function createFileName(time: Date, fileHash: string, mime: string) {
	const extStr = extension(mime);
	
	if (!extStr) {
		return null;
	}
	
	return `${time.getUTCHours()}${time.getUTCMinutes()}${time.getUTCSeconds()}_${time.getUTCMilliseconds()}_${md5(fileHash)}.${extStr}`
}

function md5(data) {
	return createHash('md5').update(data).digest("hex");
}
