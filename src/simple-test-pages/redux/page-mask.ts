import {ReduxAction} from "@gongt/ts-stl-client/redux/action";
import {reduce, VirtualStore} from "@gongt/ts-stl-client/redux/virtual-store";

export interface IPageMaskState {
	show: boolean;
}

export class PageMask extends VirtualStore<IPageMaskState> {
	defaultValue = {
		show: false,
	};
}

export interface IMaskChange {
	show: boolean;
}

export class MaskChangeAction extends ReduxAction<IMaskChange, IPageMaskState> {
}

reduce<IPageMaskState, IMaskChange>(PageMask, MaskChangeAction, (state, {show}) => {
	if (state.show !== show) {
		return {show};
	}
});

export const showMaskAction = new MaskChangeAction({show: true}, PageMask).toJSON();
export const hideMaskAction = new MaskChangeAction({show: false}, PageMask).toJSON();
