import {ReduxAction} from "@gongt/ts-stl-client/redux/action";
import {reduce, VirtualStore} from "@gongt/ts-stl-client/redux/virtual-store";

export interface FileProperty {
	name: string;
	type: string;
	size: number;
	lastModified: string;
}

export interface ICurrentFileState {
	error?: Error;
	file?: File;
	meta: object;
	prop?: FileProperty
	hash?: string;
}

export class CurrentFile extends VirtualStore<ICurrentFileState> {
	defaultValue = {
		meta: {},
	};
}

export interface IFileChange {
	newFile: File;
}

export class FileChangeAction extends ReduxAction<IFileChange, ICurrentFileState> {
}

reduce<ICurrentFileState, IFileChange>(CurrentFile, FileChangeAction, (state, action) => {
	const file = action.newFile;
	
	return {
		file: file,
		prop: {
			name: file.name,
			type: file.type,
			size: file.size,
			lastModified: file.lastModifiedDate,
		},
		meta: state.meta,
	};
});

export interface IHashChange {
	newHash: string;
}

export class HashChangeAction extends ReduxAction<IHashChange, ICurrentFileState> {
}

reduce<ICurrentFileState, IHashChange>(CurrentFile, HashChangeAction, (state, action) => {
	state.hash = action.newHash;
	state.error = null;
	return state;
});

export interface IHashError {
	hashFail: Error;
}

export class HashErrorAction extends ReduxAction<IHashError, ICurrentFileState> {
}

reduce<ICurrentFileState, IHashError>(CurrentFile, HashErrorAction, (state, action) => {
	state.error = action.hashFail;
	state.hash = null;
	return state;
});
