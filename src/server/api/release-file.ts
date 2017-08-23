import {ApiRequest, ApiResponse, STATUS_CODE} from "@gongt/ts-stl-library/request/protocol";
import {ERequestType} from "@gongt/ts-stl-library/request/request";
import {RequestError} from "@gongt/ts-stl-library/request/request-error";
import {JsonApiHandler} from "@gongt/ts-stl-server/express/api-handler";
import {FilePropertiesServer} from "../../package/public-define";
import {UploadBase} from "../database/base";
import {hold_release_check} from "../library/hold-file.inc";

export interface ReleaseFileRequest extends ApiRequest {
	id: string;
	holder: string;
	relatedId: string;
}

export interface ReleaseFileResponse extends ApiResponse {
	message: string;
}

export function releaseFileApi<T extends FilePropertiesServer>(model: UploadBase<T>) {
	const handler = new JsonApiHandler<ReleaseFileRequest, ReleaseFileResponse>(ERequestType.TYPE_POST, '/release-file');
	hold_release_check(handler);
	handler.setHandler(async (context) => {
		const {id, holder, relatedId,} = context.params;
		const data = await model.hold(false, id, {holder, relatedId});
		if (data.ok) {
			if (data.nModified > 0) {
				return {
					status: 0,
					message: 'released',
				};
			} else {
				return new RequestError(STATUS_CODE.DATA_NOT_EXISTS, 'data not found: ' + id);
			}
		} else {
			return new RequestError(STATUS_CODE.UNKNOWN_ERROR, 'database update failed');
		}
	});
	return handler;
}
