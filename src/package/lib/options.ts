import {alertJenv} from "@gongt/jenv-data/alert";
import {IS_CLIENT, IS_SERVER, isomorphicGlobal} from "@gongt/ts-stl-library/check-environment";
import {GlobalVariable} from "@gongt/ts-stl-library/pattern/global-page-data";
import {EUploadType, FileUploadPassingVar, ServiceOptions} from "../";

export function normalizeOptions(opt: ServiceOptions) {
	if (!opt) {
		throw new Error('file-upload: no options.')
	}
	guessOptions(opt);
	
	if (!opt.type) {
		throw new Error('file-upload: require option: type.');
	}
	if (!EUploadType[opt.type]) {
		throw new Error('file-upload: unknown option value: type = ' + opt.type + '.');
	}
	
	if (opt.serverHash) {
		if (IS_CLIENT) {
			throw new Error('file-upload: do not use option on client: serverHash')
		}
	} else if (IS_SERVER) {
		throw new Error('file-upload: require option on server: serverHash')
	}
	if (!opt.projectName) {
		throw new Error('file-upload: require option: projectName.')
	}
}

function guessOptions(opt: ServiceOptions) {
	alertJenv(opt, 'serverUrl');
	if (!opt.serverUrl) {
		getRequestUrl(opt);
	}
	opt.serverUrl = safeUrl(opt.serverUrl);
	if (!opt.serverUrl) {
		throw new Error('file-upload: require option: serverUrl');
	}
	if (IS_SERVER) {
		alertJenv(opt, 'serverHash');
		if (!opt.serverHash) {
			opt.serverHash = getServerToken();
		}
	}
	if (!opt.projectName) {
		if (IS_SERVER) {
			opt.projectName = process.env.PROJECT_NAME;
		} else {
			const {projectName}:any = GlobalVariable.get(isomorphicGlobal, FileUploadPassingVar) || {};
			opt.projectName = projectName;
		}
	}
	if (!opt.type) {
		const {type}:any = GlobalVariable.get(isomorphicGlobal, FileUploadPassingVar) || {};
		if (type) {
			opt.type = type;
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

export const INTERNAL_TESTING_PROJECT = 'file-upload-testing';

function getRequestUrl(opt: ServiceOptions): void {
	const {projectName} = opt;
	let {serverUrl, internalDebugMode, debugForceHttps}:any = GlobalVariable.get(isomorphicGlobal, FileUploadPassingVar) || {};
	if (serverUrl) {
		if (internalDebugMode) {
			serverUrl = location.origin + '/';
		} else if (!/https?:/.test(serverUrl)) {
			serverUrl = location.protocol + serverUrl;
		}
	} else if (IS_SERVER) {
		try {
			const {JsonEnv} = require('@gongt/jenv-data');
			serverUrl = JsonEnv.upload['apiEndPoint'] || 'http://file-upload.' + JsonEnv.baseDomainName;
			if (!process.env.RUN_IN_DOCKER && projectName === INTERNAL_TESTING_PROJECT) {
				// this package imported by file-upload server, and is testing it-self.
				serverUrl = 'http://127.0.0.1:' + process.env.LISTEN_PORT + '/';
				opt['internalDebugMode'] = true;
			} else if (JsonEnv.upload['apiEndPoint'] && !opt.hasOwnProperty('debugForceHttps')) {
				opt.debugForceHttps = true;
			}
		} catch (e) {
		}
	}
	if (debugForceHttps && /^\/\//.test(serverUrl)) {
		serverUrl = 'https:' + serverUrl;
	}
	opt.serverUrl = serverUrl;
}

function getServerToken() {
	try {
		const {JsonEnv} = require('@gongt/jenv-data');
		return JsonEnv.serverRequestKey;
	} catch (e) {
	}
}
