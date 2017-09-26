import {createLogger} from "@gongt/ts-stl-library/log/debug";
import {LOG_LEVEL} from "@gongt/ts-stl-library/log/levels";
import {createInputField} from "./lib/dom";
import {ServiceApi} from "./lib/fetch";
import {extendUrlGetter, FilePropertiesClientExtend} from "./lib/get-url";
import {normalizeOptions} from "./lib/options";
import {sha256_file} from "./lib/sha256_extra";
import {SignApiResult} from "./public-define";

const debug = createLogger(LOG_LEVEL.INFO, 'file-upload');
export {ImageProcessor} from "./processor/image";

export interface KeyValuePair {
	[id: string]: string|object;
}

export const FileUploadPassingVar = 'FileUploadRemoteUrl';

export interface ServiceOptions {
	serverHash?: string;
	projectName?: string;
	debug?: boolean;
	serverUrl?: string;
	type?: EUploadType;
}

export enum EUploadType {
	image = 'image',
	file = 'file',
}

const handleMethod = ['requestSignUrl',
	'doUploadFile',
	'completeUploadFile',
	'simpleUploadFile',
	'headlessUploadFile',
	'fetchFile',
	'holdFile',
	'releaseFile',];

export class UploadService {
	private api: ServiceApi;
	
	static readonly image = EUploadType.image;
	static readonly file = EUploadType.file;
	
	constructor(private opt: ServiceOptions) {
		normalizeOptions(opt);
		debug('create instance: %O', opt);
		this.api = new ServiceApi(opt);
		
		for (const method of handleMethod) {
			const mtd = this[method];
			this[method] = (...args: any[]) => {
				return mtd.apply(this, args).catch((e) => {
					e.message = 'UploadService.'+method + '(): ' + e.message;
					return Promise.reject(e);
				});
			};
		}
	}
	
	/** @internal */
	getOptions() {
		return Object.assign({}, this.opt);
	}
	
	/** @internal */
	getApiRef() {
		return this.api;
	}
	
	public attachUserToken(newToken: string) {
		debug('attachUserToken(%s)', newToken);
		this.api.attachUserToken(newToken);
	}
	
	passToClient() {
		return {
			serverUrl: this.opt.serverUrl.replace(/^https?:/, ''),
			projectName: this.opt.projectName,
			type: this.opt.type,
		};
	}
	
	async requestSignUrl(fileObject: File, metaData: KeyValuePair = {}): Promise<SignApiResult> {
		if (!fileObject) {
			return Promise.reject(new Error('please select file'));
		}
		if (fileObject.size > 1000 * 1000 * 500) {
			return Promise.reject(new Error('file too large, must < 500kb'));
		}
		const hash: string = await sha256_file(fileObject);
		console.log('hash file: %s', hash);
		return this.api.request('post', 'sign-upload-url', {
			mime: fileObject.type,
			meta: metaData,
			hash: hash,
		});
	}
	
	async doUploadFile(sign: SignApiResult, fileObject: File): Promise<FilePropertiesClientExtend> {
		if (sign.complete) {
			return Promise.resolve(Object.assign(sign.file, extendUrlGetter));
		}
		if (!sign.signedUrl) {
			return Promise.reject(new Error('sign failed'));
		}
		await this.api.request('put', sign.signedUrl, fileObject, {
			headers: {
				'Content-Type': fileObject.type,
			},
		});
		await this.completeUploadFile(sign);
		return Object.assign(sign.file, extendUrlGetter);
	}
	
	completeUploadFile(sign: SignApiResult) {
		return this.api.request('get', 'complete-upload', {id: sign.file._id});
	}
	
	async simpleUploadFile(fileObject: File, metaData: KeyValuePair = {}): Promise<FilePropertiesClientExtend> {
		const sign: SignApiResult = await this.requestSignUrl(fileObject, metaData);
		console.log('server sign file: %O', sign);
		if (sign.complete) {
			console.info('this file already uploaded.');
			return Object.assign(sign.file, extendUrlGetter);
		} else {
			return this.doUploadFile(sign, fileObject);
		}
	}
	
	async headlessUploadFile(metaData: KeyValuePair = {}): Promise<FilePropertiesClientExtend> {
		const file = await createInputField();
		return this.simpleUploadFile(file, metaData);
	}
	
	async fetchFile(fileId: string): Promise<FilePropertiesClientExtend> { // get the file url
		const ret = await this.api.request('get', 'fetch-file', {
			id: fileId,
		});
		return Object.assign(ret.file, extendUrlGetter);
	}
	
	holdFile(fileId: string, relatedId: string, holder: string): Promise<any> {
		if (!holder) {
			throw new Error('holdFile: `holder` param is required.');
		}
		return this.api.request('post', 'hold-file', {
			id: fileId,
			holder: this.opt.projectName + '::' + holder,
			relatedId,
		});
	}
	
	releaseFile(fileId: string, relatedId: string, holder: string): Promise<any> {
		if (!holder) {
			throw new Error('releaseFile: `holder` param is required.');
		}
		return this.api.request('post', 'release-file', {
			id: fileId,
			holder: this.opt.projectName + '::' + holder,
			relatedId,
		});
	}
}
