import {LOG_LEVEL} from "@gongt/ts-stl-library/log/levels";
import {createLogger} from "@gongt/ts-stl-server/debug";
import {FileProperties} from "../../../package/public-define";
import request = require("request");

const debug = createLogger(LOG_LEVEL.DEBUG, 'request');

export function downloadFile({urlInternal}: FileProperties): Promise<Buffer> {
	debug('check file: %s', urlInternal);
	
	return new Promise<Buffer>((resolve) => {
		request(urlInternal, {encoding: null}, (err, resp, body) => {
			if (err) {
				console.error('base.driver: http error: ', err);
				debug('request failed: %s', err);
				return resolve(null); // 未知错误，保持状态不变，等下次再试}
			}
			debug('server response: %s', resp.statusCode);
			if (resp.statusCode < 200 || resp.statusCode > 299) {
				resolve(null); // 文件还没上传，或者权限错误（不可能出现），或者一些临时错误，下次请求可能会变正常
			} else {
				resolve(body);
			}
		});
	});
}
