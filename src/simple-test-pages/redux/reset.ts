import {ReduxStoreWindow} from "@gongt/ts-stl-client/redux/store-client";
import {AppState} from "../index";
import {FileChangeAction} from "./current-file";
import {ResetAction} from "./reset.action";

export function resetPageState(redux: ReduxStoreWindow<AppState>) {
	redux.useSimple((store, action) => {
		if (FileChangeAction.is(action)) {
			store.dispatch(new ResetAction(null).toJSON());
		}
		return action;
	});
}
