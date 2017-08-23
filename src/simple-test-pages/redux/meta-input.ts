import {ReduxAction} from "@gongt/ts-stl-client/redux/action";
import {reduce, VirtualStore} from "@gongt/ts-stl-client/redux/virtual-store";

export interface IMetaInputState {
	content: string;
	isOk: boolean;
	data: object;
}

export class MetaContent extends VirtualStore<IMetaInputState> {
	defaultValue = {
		content: "",
		isOk: true,
		data: {},
	};
}

export interface IMetaChange {
	content: string;
}

export class MetaChangeAction extends ReduxAction<IMetaChange, IMetaInputState> {
}

reduce<IMetaInputState, IMetaChange>(MetaContent, MetaChangeAction, (state, {content}) => {
	content = content.trim();
	if (!content.trim()) {
		return {
			content: '',
			data: {},
			isOk: true,
		};
	}
	state.content = content;
	try {
		state.data = null;
		eval('state.data = ' + content);
		state.isOk = true;
	} catch (e) {
		state.isOk = false;
		state.data = null;
	}
	return state;
});
