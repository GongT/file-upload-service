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
	if (!opt.serverUrl) {
		opt.serverUrl = getRequestUrl();
	}
	opt.serverUrl = safeUrl(opt.serverUrl);
	if (!opt.serverUrl) {
		throw new Error('file-upload: require option: serverUrl');
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

function getRequestUrl() {
	let {serverUrl}:any = GlobalVariable.get(isomorphicGlobal, FileUploadPassingVar) || {};
	if (serverUrl) {
		if (!/https?:/.test(serverUrl)) {
			serverUrl = location.protocol + serverUrl;
		}
	} else if (IS_SERVER) {
		try {
			const {JsonEnv} = require('@gongt/jenv-data');
			serverUrl = JsonEnv.upload['apiEndPoint'] || 'http://file-upload.' + JsonEnv.baseDomainName;
		} catch (e) {
		}
	}
	return serverUrl;
}

function getServerToken() {
	try {
		const {JsonEnv} = require('@gongt/jenv-data');
		return JsonEnv.serverRequestKey;
	} catch (e) {
	}
}
