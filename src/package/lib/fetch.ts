import {createLogger} from "@gongt/ts-stl-library/log/debug";
import {LOG_LEVEL} from "@gongt/ts-stl-library/log/levels";
import {ServiceOptions} from "../";
import {noSlashStart} from "./string";
import Qs = require('qs');

const debug = createLogger(LOG_LEVEL.INFO, 'file-upload');

export type FetchApi = (...args: any[]) => Promise<any>;

let _fetch: FetchApi;
if (typeof window === 'object') {
	require("whatwg-fetch");
	_fetch = window['fetch'].bind(undefined);
} else {
	_fetch = (void 0 || require)('node-fetch');
}

export const fetch: FetchApi = _fetch;

export class ServiceApi {
	private userToken: string;
	
	constructor(private opt: ServiceOptions) {
	}
	
	public attachUserToken(newToken: string) {
		this.userToken = newToken;
	}
	
	public async request(method: string, uri: string, params?: any, _options: any = {}) {
		let req;
		let requestHeaders: any = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Image-Upload-Debug': this.opt.debug? 'yes' : '',
		};
		if (!/^https?:\/\//.test(uri)) {
			if (!uri) {
				throw new TypeError('fetch: no url argument.');
			}
			const type = this.opt.type;
			uri = `${this.opt.serverUrl}api/${type}/${noSlashStart(uri)}`;
		}
		if (this.userToken) {
			requestHeaders['X-Image-Login-Token'] = this.userToken;
		}
		if (_options.headers) {
			Object.assign(requestHeaders, _options.headers);
		}
		
		method = method.toLowerCase();
		if (params) {
			if (this.opt.serverHash && (method !== 'put')) {
				params.serverHash = this.opt.serverHash;
			}
			if (method === 'post') {
				req = {
					method: method,
					body: JSON.stringify(params),
				};
			} else if (method === 'put') {
				req = {
					method: method,
					body: params,
				};
			} else {
				uri = uri + '?' + Qs.stringify(params);
				req = {
					method: method,
				};
			}
		} else {
			req = {
				method: method,
			};
		}
		
		req.headers = requestHeaders;
		if (!req.credentials) {
			req.credentials = 'same-origin';
		}
		req.mode = 'cors';
		req.redirect = 'follow';
		req.cache = 'no-cache';
		
		debug('fetch: %s %O', uri, req);
		const response = await fetch(uri, req);
		let data;
		if (response.status === 200) {
			if (/\/json/.test(response.headers.get('content-type'))) {
				data = await response.json();
			} else {
				data = await response.text();
			}
		} else {
			throw {
				status: response.status,
				message: `http error: ${response.statusText}`,
			};
		}
		if (typeof data === 'string') {
			if (data) {
				throw new Error(data);
			}
		} else if (data.status === 0) {
			return data;
		} else {
			throw data;
		}
	}
}


