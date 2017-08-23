import {STATUS_CODE} from "@gongt/ts-stl-library/request/protocol";
import {RequestError} from "@gongt/ts-stl-library/request/request-error";
import {JsonApiHandler} from "@gongt/ts-stl-server/express/api-handler";
import {ValueChecker} from "@gongt/ts-stl-server/value-checker/value-checker";

export function hold_release_check(handler: JsonApiHandler<any, any>) {
	handler.handleArgument('id').fromPost().filter(new ValueChecker().isString().isNotEmpty());
	handler.handleArgument('holder').fromPost().filter(new ValueChecker().isString().isNotEmpty());
	handler.handleArgument('relatedId').fromPost().filter(new ValueChecker().isString().isNotEmpty());
	handler.handleArgument('serverHash').fromPost().filter((hash) => {
		if (hash !== JsonEnv.serverRequestKey) {
			throw new RequestError(STATUS_CODE.INVALID_INPUT, `value filter failed - [serverHash]`);
		}
	});
}
