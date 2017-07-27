import {UploadService} from "@gongt/file-upload-client/index";
import {FileProperties, SignResult} from "@gongt/file-upload-client/public-define";
import * as React from "react";

export interface TestingContext {
	last_result: any;
	last_status: number;
	signOk?: boolean;
	sign: SignResult;
	uploadOk?: boolean;
	upload: any;
	complete: any;
	shareFile: FileProperties;
	fileObject: File;
	fileId: string;
	api: UploadService;
	handleResult: (res: any) => void;
	handlePromise: (p: Promise<any>) => void;
	updateContext: (up: any) => void;
	meta: any;
}

export const testContext = {
	last_result: React.PropTypes.object,
	last_status: React.PropTypes.number,
	signOk: React.PropTypes.any,
	sign: React.PropTypes.object,
	uploadOk: React.PropTypes.object,
	upload: React.PropTypes.any,
	complete: React.PropTypes.any,
	shareFile: React.PropTypes.object,
	fileObject: React.PropTypes.object,
	api: React.PropTypes.object,
	handleResult: Function,
	handlePromise: Function,
	updateContext: Function,
	meta: React.PropTypes.any,
	fileId: React.PropTypes.string,
};
