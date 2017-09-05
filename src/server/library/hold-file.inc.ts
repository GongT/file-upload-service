import {JsonApiHandler} from "@gongt/ts-stl-server/express/api-handler";
import {serverRequestOnly} from "@gongt/ts-stl-server/safe/server-request-only";
import {ValueChecker} from "@gongt/ts-stl-server/value-checker/value-checker";

export function hold_release_check(handler: JsonApiHandler<any, any>) {
	handler.handleArgument('id').fromPost().filter(new ValueChecker().isString().isNotEmpty());
	handler.handleArgument('holder').fromPost().filter(new ValueChecker().isString().isNotEmpty());
	handler.handleArgument('relatedId').fromPost().filter(new ValueChecker().isString().isNotEmpty());
	handler.prependMiddleware(serverRequestOnly());
}
