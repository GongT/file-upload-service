import {IS_CLIENT, IS_SERVER, isomorphicGlobal} from "@gongt/ts-stl-library/check-environment";
import {GlobalVariable} from "@gongt/ts-stl-library/pattern/global-page-data";
import {fetch} from "./fetch";
import {FilePropertiesClient, SignApiResult} from "./public-define";
import {sha256_file} from "./sha256_extra";
import Qs = require('qs');

declare const process: any, global: any;

export interface FilePropertiesClientExtend extends FilePropertiesClient {
	toUrl(internal: boolean): string;
}

const extendUrlGetter = {
	toUrl(this: FilePropertiesClient, internal: boolean): string{
		if (internal) {
			return this.urlInternal;
		} else {
			return this.url;
		}
	},
};

declare const require: any;
try {
	global['require']("source-map-support/register");
} catch (e) {
}

export interface KeyValuePair {
	[id: string]: string;
}

declare const JsonEnv: any;

function slashEnd(str) {
	return str.replace(/([^\/])$/, '$1/');
}
function noSlashStart(str) {
	return str.replace(/^\//g, '$1/');
}

export interface ServiceOptions {
	serverHash?: string;
	projectName?: string;
	debug?: boolean;
	serverUrl?: string;
}

let fileObject;

function getServerToken() {
	try {
		const {JsonEnv} = require('@gongt/jenv-data');
		return JsonEnv.serverRequestKey;
	} catch (e) {
	}
}
export const FileUploadPassingVar = 'FileUploadRemoteUrl';
function getRequestUrl() {
	let {url}:any = GlobalVariable.get(isomorphicGlobal, FileUploadPassingVar) || {};
	if (url) {
		if (!/https?:/.test(url)) {
			url = location.protocol + url;
		}
	} else if (IS_SERVER) {
		try {
			const {JsonEnv} = require('@gongt/jenv-data');
			url = JsonEnv.upload['apiEndPoint'] || 'http://file-upload.' + JsonEnv.baseDomainName;
		} catch (e) {
		}
	}
	return url;
}

function guessOptions(opt: ServiceOptions) {
	if (!opt.serverUrl) {
		opt.serverUrl = getRequestUrl();
	}
	if (!opt.serverHash && IS_SERVER) {
		opt.serverHash = getServerToken();
	}
	if (!opt.projectName) {
		if (IS_SERVER) {
			opt.projectName = process.env.PROJECT_NAME;
		} else {
			const {projectName}:any = GlobalVariable.get(isomorphicGlobal, FileUploadPassingVar) || {};
			opt.projectName = projectName;
		}
	}
}
function safeUrl(str: string) {
	if (!str) {
		return str;
	}
	if (!/^https?:/.test(str)) {
		str = location.protocol + str;
	}
	if (!/\/$/.test(str)) {
		str += '/';
	}
	return str;
}

export class UploadService {
	private serverHash: string;
	private projectName: string;
	private userToken: string;
	private requestUrl: string;
	private debug: boolean;
	
	constructor(opt: ServiceOptions) {
		if (!opt) {
			throw new Error('file-upload: no options.')
		}
		guessOptions(opt);
		
		this.debug = opt.debug;
		
		this.requestUrl = safeUrl(opt.serverUrl);
		if (!this.requestUrl) {
			throw new Error('file-upload: require option: requestUrl');
		}
		if (opt.serverHash) {
			if (IS_CLIENT) {
				throw new Error('file-upload: do not use option on client: serverHash')
			}
			this.serverHash = opt.serverHash;
		} else if (IS_SERVER) {
			throw new Error('file-upload: require option on server: serverHash')
		}
		if (opt.projectName) {
			this.projectName = opt.projectName;
		} else {
			throw new Error('file-upload: require option: projectName.')
		}
	}
	
	_pass() {
		return {
			url: this.requestUrl.replace(/^https?:/, ''),
			projectName: this.projectName,
		};
	}
	
	attachUserToken(newToken: string) {
		this.userToken = newToken;
	}
	
	requestSignUrl(fileObject: File, metaData: KeyValuePair = {}): Promise<SignApiResult> {
		if (!fileObject) {
			return Promise.reject(new Error('please select file'));
		}
		if (fileObject.size > 1000 * 1000 * 500) {
			return Promise.reject(new Error('file too large, must < 500kb'));
		}
		return <any> sha256_file(fileObject).then((hash) => {
			console.log('hash file: %s', hash);
			return this.api('post', 'sign-upload-url', {
				mime: fileObject.type,
				meta: metaData,
				hash: hash,
			});
		});
	}
	
	doUploadFile(sign: SignApiResult, fileObject: File): Promise<FilePropertiesClientExtend> {
		if (sign.complete) {
			return Promise.resolve(Object.assign(sign.file, extendUrlGetter));
		}
		return this.api('put', sign.signedUrl, fileObject, {
			headers: {
				'Content-Type': fileObject.type,
			},
		}).then(() => {
			return this.completeUploadFile(sign);
		}).then(() => {
			return Object.assign(sign.file, extendUrlGetter);
		});
	}
	
	completeUploadFile(sign: SignApiResult) {
		return this.api('get', 'complete-upload', {id: sign.file._id});
	}
	
	simpleUploadFile(fileObject: File, metaData: KeyValuePair = {}): Promise<FilePropertiesClientExtend> {
		return this.requestSignUrl(fileObject, metaData).then((sign: SignApiResult) => {
			console.log('server sign file: %O', sign);
			if (sign.complete) {
				console.info('this file already uploaded.');
				return Object.assign(sign.file, extendUrlGetter);
			} else {
				return this.doUploadFile(sign, fileObject);
			}
		});
	}
	
	headlessUploadFile(metaData: KeyValuePair = {}): Promise<FilePropertiesClientExtend> {
		if (typeof window !== 'object') {
			throw new TypeError(`Can't use headless upload on server.`);
		}
		if (typeof event !== 'object') {
			throw new TypeError(`headless upload must call during click callback.`);
		}
		
		const file: HTMLInputElement = <any> document.createElement('INPUT');
		file.setAttribute('type', 'file');
		file.style.display = 'none';
		
		document.body.appendChild(file);
		const p: any = new Promise((resolve, reject) => {
			file.addEventListener('change', () => {
				if (file.files && file.files[0]) {
					const p1 = this.simpleUploadFile(file.files[0], metaData);
					p1.then(resolve, reject);
					const cb = destroy.bind(undefined, file);
					p1.then(cb, cb)
				} else {
					reject();
				}
			});
		});
		file.click();
		if (fileObject) {
			destroy(fileObject);
		}
		fileObject = file;
		
		return p;
	}
	
	fetchFile(fileId: string): Promise<FilePropertiesClientExtend> { // get the file url
		return this.api('get', 'fetch-file', {
			id: fileId,
			serverHash: this.serverHash,
		}).then((ret) => {
			return Object.assign(ret.file, extendUrlGetter);
		});
	}
	
	holdFile(fileId: string, relatedId: string, holder: string): Promise<any> {
		if (!holder) {
			throw new Error('holdFile: `holder` param is required.');
		}
		return this.api('post', 'hold-file', {
			id: fileId,
			holder: this.projectName + '::' + holder,
			relatedId,
			serverHash: this.serverHash,
		});
	}
	
	releaseFile(fileId: string, relatedId: string, holder: string): Promise<any> {
		if (!holder) {
			throw new Error('releaseFile: `holder` param is required.');
		}
		return this.api('post', 'release-file', {
			id: fileId,
			holder: this.projectName + '::' + holder,
			relatedId,
			serverHash: this.serverHash,
		});
	}
	
	api(method: string, uri: string, params?: any, _options: any = {}) {
		let req;
		if (!/^https?:\/\//.test(uri)) {
			uri = this.requestUrl + 'api/' + noSlashStart(uri);
		}
		method = method.toLowerCase();
		if (params) {
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
		}
		
		req.headers = Object.assign({
			'X-Image-Login-Token': this.userToken,
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Image-Upload-Debug': this.debug? 'yes' : '',
		}, _options.headers);
		if (!req.credentials) {
			req.credentials = 'same-origin';
		}
		req.mode = 'cors';
		req.redirect = 'follow';
		req.cache = 'no-cache';
		
		return fetch(uri, req).then((response) => {
			if (response.status === 200) {
				if (/\/json/.test(response.headers.get('content-type'))) {
					return response.json();
				} else {
					return response.text();
				}
			}
			throw {
				status: response.status,
				message: `http error: ${response.statusText}`,
			};
		}).then((data) => {
			if (typeof data === 'string') {
				if (data) {
					throw new Error(data);
				}
			} else if (data.status === 0) {
				return data;
			} else {
				throw data;
			}
		});
	}
}

function destroy(file: HTMLInputElement) {
	document.body.removeChild(file);
	if (fileObject === file) {
		fileObject = null;
	}
}
