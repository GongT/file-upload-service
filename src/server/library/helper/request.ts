import {FileProperties} from "../../../package/public-define";
import {createDebug} from "../../debug";
import request = require("request");

const debugCheck = createDebug('hash-check');

export function downloadFile({urlInternal}: FileProperties): Promise<void|Buffer> {
	debugCheck('check file: %s', urlInternal);
	
	return new Promise<void|Buffer>((resolve) => {
		request(urlInternal, {encoding: null}, (err, resp, body) => {
			if (err) {
				console.error('base.driver: http error: ', err);
				debugCheck('request failed: %s', err);
				return resolve(); // 未知错误，保持状态不变，等下次再试}
			}
			debugCheck('server response: %s', resp.statusCode);
			if (resp.statusCode < 200 || resp.statusCode > 299) {
				resolve(); // 文件还没上传，或者权限错误（不可能出现），或者一些临时错误，下次请求可能会变正常
			} else {
				resolve(body);
			}
		});
	});
}
