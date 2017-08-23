import {ApiRequest, ApiResponse, STATUS_CODE} from "@gongt/ts-stl-library/request/protocol";
import {ERequestType} from "@gongt/ts-stl-library/request/request";
import {RequestError} from "@gongt/ts-stl-library/request/request-error";
import {JsonApiHandler} from "@gongt/ts-stl-server/express/api-handler";
import {FilePropertiesServer} from "../../package/public-define";
import {UploadBase} from "../database/base";
import {hold_release_check} from "../library/hold-file.inc";

export interface HoldFileRequest extends ApiRequest {
	id: string;
	holder: string;
	relatedId: string;
}

export interface HoldFileResponse extends ApiResponse {
	message: string;
}

export function holdFileApi<T extends FilePropertiesServer>(model: UploadBase<T>) {
	const handler = new JsonApiHandler<HoldFileRequest, HoldFileResponse>(ERequestType.TYPE_POST, '/hold-file');
	hold_release_check(handler);
	handler.setHandler(async (context) => {
		const {id, holder, relatedId,} = context.params;
		const data = await model.hold(true, id, {holder, relatedId});
		if (data.ok) {
			if (data.nModified > 0) {
				return {
					status: 0,
					message: 'holding',
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
