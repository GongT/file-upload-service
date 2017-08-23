import {ReduxAction} from "@gongt/ts-stl-client/redux/action";
import {reduce, VirtualStore} from "@gongt/ts-stl-client/redux/virtual-store";
import {AppState} from "../";

export interface ICompleteState {
}

export class CompleteHandler extends VirtualStore<ICompleteState> {
	defaultValue = {};
}

export class CompleteAction extends ReduxAction<any, ICompleteState> {
}

reduce<ICompleteState, any>(CompleteHandler, CompleteAction, (state, data) => {
	return data;
});

export interface ICompleteFail {
	message: string;
	status: number;
}

export class CompleteFailAction extends ReduxAction<ICompleteFail, ICompleteState> {
}

reduce<ICompleteState, ICompleteFail>(CompleteHandler, CompleteFailAction, (state, error) => {
	debugger;
	return error;
});

export function selectCompleteResult(state: AppState) {
	return state.CompleteHandler || null;
}
