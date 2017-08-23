import {sha256_file} from "@gongt/file-upload-client/lib/sha256_extra";
import {ReduxStoreWindow} from "@gongt/ts-stl-client/redux/store-client";
import {AppState} from "../index";
import {CurrentFile, HashChangeAction, HashErrorAction} from "./current-file";

export function hashNewFile(redux: ReduxStoreWindow<AppState>) {
	redux.logicDisplayBorder((subscribe, dispatch) => {
		let last: File;
		subscribe((state) => {
			const {file, hash, error} = state.CurrentFile;
			if (!file) {
				return;
			}
			if (hash || error) {
				return;
			}
			if (file === last) {
				return;
			}
			
			last = file;
			const p = sha256_file(file).then((hash) => {
				if (file === last) {
					dispatch(new HashChangeAction({newHash: hash}, CurrentFile));
				}
			}, (err) => {
				if (file === last) {
					dispatch(new HashErrorAction({hashFail: err}, CurrentFile));
				}
			});
		});
	});
}
