import {ReduxAction} from "@gongt/ts-stl-client/redux/action";
import {reduce, VirtualStore} from "@gongt/ts-stl-client/redux/virtual-store";
import {AppState} from "../";

export interface IUploadState {
}

export class UploadHandler extends VirtualStore<IUploadState> {
	defaultValue = {};
}

export class UploadAction extends ReduxAction<any, IUploadState> {
}

reduce<IUploadState, any>(UploadHandler, UploadAction, (state, data) => {
	return data;
});

export interface IUploadFail {
	message: string;
	status: number;
}

export class UploadFailAction extends ReduxAction<IUploadFail, IUploadState> {
}

reduce<IUploadState, IUploadFail>(UploadHandler, UploadFailAction, (state, error) => {
	debugger;
	return error;
});

export function selectUploadResult(state: AppState) {
	return state.UploadHandler || null;
}
