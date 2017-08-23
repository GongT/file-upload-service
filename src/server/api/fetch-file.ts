import {ApiRequest, ApiResponse} from "@gongt/ts-stl-library/request/protocol";
import {ERequestType} from "@gongt/ts-stl-library/request/request";
import {JsonApiHandler} from "@gongt/ts-stl-server/express/api-handler";
import {ValueChecker} from "@gongt/ts-stl-server/value-checker/value-checker";
import {FilePropertiesClient, FilePropertiesServer} from "../../package/public-define";
import {UploadBase} from "../database/base";

export interface FetchFileRequest extends ApiRequest {
	id: string;
}

export interface FetchFileResponse extends ApiResponse {
	file: FilePropertiesClient;
}

export function fetchFileApi<T extends FilePropertiesServer>(model: UploadBase<T>) {
	const handler = new JsonApiHandler<FetchFileRequest, FetchFileResponse>(ERequestType.TYPE_GET, '/fetch-file');
	handler.handleArgument('id').fromGet().filter(new ValueChecker().isString().isNotEmpty().getFunction());
	handler.setHandler(async (context) => {
		const fileObject = await model.getById(context.params.id);
		const data: FilePropertiesClient = Object.assign({}, fileObject.toObject(), {
			holders: fileObject.holders.length,
		});
		return {
			status: 0,
			file: data,
		};
	});
	return handler;
}
