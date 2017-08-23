import {SignApiResult} from "@gongt/file-upload-client/public-define";
import {ReduxAction} from "@gongt/ts-stl-client/redux/action";
import {reduce, VirtualStore} from "@gongt/ts-stl-client/redux/virtual-store";
import {ApiResponse} from "@gongt/ts-stl-library/request/protocol";
import {AppState} from "../";

export interface ISignState extends Partial<SignApiResult> {
	error?: Error|ApiResponse;
}

export class SignHandler extends VirtualStore<ISignState> {
	defaultValue: ISignState = {
		complete: false,
		file: null,
	};
}

export class SignAction extends ReduxAction<SignApiResult, ISignState> {
}

reduce<ISignState, SignApiResult>(SignHandler, SignAction, (state, data) => {
	return data;
});

export interface ISignFail {
	message: string;
	status: number;
}

export class SignFailAction extends ReduxAction<ISignFail, ISignState> {
}

reduce<ISignState, ISignFail>(SignHandler, SignFailAction, (state, error) => {
	debugger;
	return {error: error};
});

export function selectSignResult(state: AppState) {
	if (!state.SignHandler) {
		return null;
	}
	if (state.SignHandler.error) {
		return state.SignHandler.error;
	} else {
		return state.SignHandler.file;
	}
}
