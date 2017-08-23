import {ApiRequest, ApiResponse} from "@gongt/ts-stl-library/request/protocol";
import {ERequestType} from "@gongt/ts-stl-library/request/request";
import {RequestError} from "@gongt/ts-stl-library/request/request-error";
import {JsonApiHandler} from "@gongt/ts-stl-server/express/api-handler";
import {ValueChecker} from "@gongt/ts-stl-server/value-checker/value-checker";
import {FilePropertiesServer} from "../../package/public-define";
import {UploadBase} from "../database/base";

export interface CompleteRequest extends ApiRequest {
	id: string;
}

export interface CompleteResponse extends ApiResponse {
}

export function completeUploadApi<T extends FilePropertiesServer>(model: UploadBase<T>) {
	const handler = new JsonApiHandler<CompleteRequest, CompleteResponse>(ERequestType.TYPE_GET, '/complete-upload');
	handler.handleArgument('id').fromGet().filter(new ValueChecker().isString().isNotEmpty().getFunction());
	handler.setHandler(async (context) => {
		const object = await model.getById(context.params.id);
		if (!object) {
			throw new Error('no such file record');
		}
		
		const checkedObject = await model.checkUploadedFile(object);
		if (checkedObject && checkedObject.hasUploaded) {
			return {
				status: 0,
				message: 'file upload complete.',
			};
		} else {
			return new RequestError(-1, 'file not upload complete.');
		}
	});
	return handler;
}
