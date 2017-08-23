import {LOG_LEVEL} from "@gongt/ts-stl-library/log/levels";
import {createLogger} from "@gongt/ts-stl-server/debug";

const mmm = require('mmmagic');

const debug = createLogger(LOG_LEVEL.DEBUG, 'mime');

export function detectMime(buffer: Buffer) {
	const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
	
	return new Promise((resolve, reject) => {
		magic.detect(buffer, function (err, data) {
			if (err) {
				return reject(err);
			} else {
				debug('detected mime type is: %s', data);
				return resolve(data);
			}
		});
	});
}
