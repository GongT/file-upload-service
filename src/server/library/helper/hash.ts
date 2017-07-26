import ReadableStream = NodeJS.ReadableStream;
import {createHash} from "crypto";
import {FileProperties} from "../../../package/public-define";
import {createDebug} from "../../debug";

const debugCheck = createDebug('hash-check');

export function hashBuffer(buffer: Buffer): string {
	const hashString = createHash('sha256').update(buffer).digest().toString('hex').toLowerCase();
	debugCheck('hash response: %s', hashString);
	return hashString;
}

export function compareHash(object: FileProperties, hashString) {
	const remoteFileHash = hashString;
	const localFileHash = object.fileHash.toLowerCase();
	if (localFileHash === remoteFileHash) {
		// 文件已经存在，hash符合，一切正常
		debugCheck('remote file hash OK!');
		debugCheck('    hash: %s', remoteFileHash);
		return true; // uploaded and valid
	} else {
		debugCheck('remote file hash FAILED!');
		debugCheck('    local: %s', localFileHash);
		debugCheck('   remote: %s', remoteFileHash);
		// PS：aws和oss都是原子的，不会出现半个文件
		// 这个文件已经在服务器存在，并且hash和文件名不符 - 恶意文件，将会标记删除
		return false; // uploaded, but not valid
	}
}
