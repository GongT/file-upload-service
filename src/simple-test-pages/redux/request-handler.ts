import {IReduxActionConstructor, ReduxAction} from "@gongt/ts-stl-client/redux/action";
import {ReduxStoreWindow} from "@gongt/ts-stl-client/redux/store-client";
import {IVirtualStoreConstructor, reduce, VirtualStore} from "@gongt/ts-stl-client/redux/virtual-store";
import {ErrorResponse, RequestError} from "@gongt/ts-stl-library/request/request-error";
import {hideMaskAction, showMaskAction} from "./page-mask";

export interface IRequestState {
	lastData?: any;
	lastError?: Error;
}

export class RequestHandler extends VirtualStore<IRequestState> {
	defaultValue = {};
}

export interface IRequestP<T, Y = any> {
	promise: Promise<T>;
}

export interface IRequestA {
	api: string;
	args: any[];
}

export interface IRequestR {
	store: IVirtualStoreConstructor<any>;
	success: IReduxActionConstructor<any, any>;
	failed: IReduxActionConstructor<ErrorResponse, any>;
}

export type IRequest<T, Y = any> = (IRequestP<T, Y>|IRequestA)|(IRequestP<T, Y>&IRequestR|IRequestA&IRequestR);

export class RequestAction<T> extends ReduxAction<IRequest<T>, IRequestState> {
}

reduce<IRequestState, IRequest<any>>(RequestHandler, RequestAction, () => {
});

export interface IResponse {
	data?: any;
	error?: Error;
}

export class ResponseAction extends ReduxAction<IResponse, IRequestState> {
}

reduce<IRequestState, IResponse>(RequestHandler, ResponseAction, (state, {data, error}) => {
	return {
		lastData: data,
		lastError: error,
	};
});

export function promiseHandler(redux: ReduxStoreWindow<any>) {
	redux.useSimple<IRequest<any>>((store, action) => {
		if (!RequestAction.is(action)) {
			return action;
		}
		const payload = action.payload;
		store.dispatch(showMaskAction);
		
		let promise;
		
		if (payload.hasOwnProperty('promise')) {
			promise = (payload as IRequestP<any, any>).promise;
		} else {
			const {api, args} = payload as IRequestA;
			promise = store.getState()
				.ServiceObject[api](...args);
		}
		if (payload.hasOwnProperty('success')) {
			const {success, store: subStore} = payload as IRequestR;
			promise.then((data) => {
				store.dispatch(new success(data, subStore).toJSON());
			});
		}
		if (payload.hasOwnProperty('failed')) {
			const {failed, store: subStore} = payload as IRequestR;
			promise.catch((err) => {
				store.dispatch(new failed(RequestError.convert(err).response(), subStore).toJSON());
			});
		}
		
		return promise.then((data) => {
			store.dispatch(hideMaskAction);
			return <any>new ResponseAction({data}, RequestHandler).toJSON();
		}, (error) => {
			store.dispatch(hideMaskAction);
			return <any>new ResponseAction({error}, RequestHandler).toJSON();
		});
	});
}
