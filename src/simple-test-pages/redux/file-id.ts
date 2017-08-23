import {ReduxAction} from "@gongt/ts-stl-client/redux/action";
import {reduce, reduceAny, VirtualStore} from "@gongt/ts-stl-client/redux/virtual-store";
import {AppState} from "../";
import {ResponseAction} from "./request-handler";

export interface IFileIdState {
	id: string;
}

export class FileIdStore extends VirtualStore<IFileIdState> {
	defaultValue = {id: ''};
}

export class FileIdAction extends ReduxAction<any, IFileIdState> {
	id: string;
}

reduce<IFileIdState, any>(FileIdStore, FileIdAction, (state, {id}) => {
	return {id};
});
reduceAny<IFileIdState, any>(FileIdStore, ResponseAction, (state, {data, error}) => {
	if (data && data.file && data.file._id) {
		return {id: data.file._id};
	}
});

export interface IFileIdProps {
	fileId?: string;
}

export function selectFileIdResult(state: AppState) {
	return {fileId: state.FileIdStore.id};
}
