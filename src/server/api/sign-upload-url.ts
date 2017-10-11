import {ApiRequest, ApiResponse, STATUS_CODE} from "@gongt/ts-stl-library/request/protocol";
import {ERequestType} from "@gongt/ts-stl-library/request/request";
import {RequestError} from "@gongt/ts-stl-library/request/request-error";
import {JsonApiHandler} from "@gongt/ts-stl-server/express/api-handler";
import {ValueChecker} from "@gongt/ts-stl-server/value-checker/value-checker";
import {KeyValuePair} from "../../package";
import {FilePropertiesClient, FilePropertiesServer, SignApiResult} from "../../package/public-define";
import {UploadBase} from "../database/base";

export interface SignRequest extends ApiRequest {
	mime: string;
	hash: string;
	meta: KeyValuePair;
}

export interface SignResponse extends ApiResponse, SignApiResult {
}

export function signUploadUrlApi<T extends FilePropertiesServer>(model: UploadBase<T>) {
	const handler = new JsonApiHandler<SignRequest, SignResponse>(ERequestType.TYPE_POST, '/sign-upload-url');
	handler.handleArgument('meta').fromPost().optional({}).filter(new ValueChecker().isObject().getFunction());
	handler.handleArgument('hash').fromPost().filter(new ValueChecker().isString().isNotEmpty().getFunction());
	handler.handleArgument('mime').fromPost().optional('application/octet-stream').filter(new ValueChecker().isString().isNotEmpty().getFunction());
	handler.setHandler(async (context) => {
		const {mime, hash, meta,} = context.params;
		handler.sill('request check ok: file type is %s', mime);
		let uploadUrl: string = '';
		
		if (!model.verifyType(mime)) {
			throw new RequestError(STATUS_CODE.INVALID_INPUT, 'file type wrong');
		}
		
		const fileObject = await model.checkExistsByHash(hash, {mime: mime}, meta).then((fileObject) => {
			if (fileObject.hasUploaded) {
				return fileObject;
			} else {
				return model.storage.sign(fileObject).then((signResult) => {
					uploadUrl = signResult.uploadUrl;
					
					fileObject.set('url', signResult.fetchUrl);
					fileObject.set('urlInternal', signResult.fetchUrlInternal);
					
					handler.sill('create new instance: %s', fileObject._id);
					return fileObject.save();
				});
			}
		});
		
		const data: FilePropertiesClient = Object.assign({}, fileObject.toObject(), {
			holders: fileObject.holders.length,
		});
		
		return {
			status: 0,
			complete: fileObject.hasUploaded,
			signedUrl: uploadUrl,
			file: data,
		};
	});
	return handler;
}
