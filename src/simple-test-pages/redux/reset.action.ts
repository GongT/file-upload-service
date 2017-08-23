import {ReduxAction} from "@gongt/ts-stl-client/redux/action";
import {reduceAny} from "@gongt/ts-stl-client/redux/virtual-store";
import {CompleteHandler} from "./complete";
import {RequestHandler} from "./request-handler";
import {SignHandler} from "./sign";
import {UploadHandler} from "./upload";

export class ResetAction extends ReduxAction<void, any> {
}

reduceAny(SignHandler, ResetAction, (state, data) => {
	return {};
});

reduceAny(UploadHandler, ResetAction, (state, data) => {
	return {};
});

reduceAny(CompleteHandler, ResetAction, (state, data) => {
	return {};
});

reduceAny(RequestHandler, ResetAction, (state, data) => {
	return {};
});
