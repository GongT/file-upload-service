import {UploadService} from "@gongt/file-upload-client/index";
import {reactUseRedux} from "@gongt/ts-stl-client/react-redux/client";
import {ReactRender} from "@gongt/ts-stl-client/react/render";
import {IState} from "@gongt/ts-stl-client/redux/preload-state";
import {AppStore as AppStoreBase} from "@gongt/ts-stl-client/redux/store";
import {ReduxStoreWindow} from "@gongt/ts-stl-client/redux/store-client";
import * as React from "react";
import {RootComponent} from "./homepage";
import {CompleteHandler, ICompleteState} from "./redux/complete";
import {CurrentFile, ICurrentFileState} from "./redux/current-file";
import {FileIdStore, IFileIdState} from "./redux/file-id";
import {hashNewFile} from "./redux/hash";
import {IMetaInputState, MetaContent} from "./redux/meta-input";
import {IPageMaskState, PageMask} from "./redux/page-mask";
import {IRequestState, promiseHandler, RequestHandler} from "./redux/request-handler";
import {resetPageState} from "./redux/reset";
import {ServiceObject} from "./redux/service-object";
import {ISignState, SignHandler} from "./redux/sign";
import {IUploadState, UploadHandler} from "./redux/upload";

const react = new ReactRender;
react.setMainApp(() => {
	return <RootComponent/>;
});

export interface AppState extends IState {
	CurrentFile: ICurrentFileState;
	MetaContent: IMetaInputState;
	PageMask: IPageMaskState;
	RequestHandler: IRequestState;
	ServiceObject: UploadService;
	SignHandler: ISignState;
	UploadHandler: IUploadState;
	CompleteHandler: ICompleteState;
	FileIdStore: IFileIdState;
}

export interface AppStore extends AppStoreBase<AppState> {
}

const redux = new ReduxStoreWindow<AppState>([
	hashNewFile,
	promiseHandler,
	resetPageState,
]);
redux.register(CurrentFile);
redux.register(MetaContent);
redux.register(PageMask);
redux.register(RequestHandler);
redux.register(ServiceObject);
redux.register(SignHandler);
redux.register(UploadHandler);
redux.register(CompleteHandler);
redux.register(FileIdStore);

redux.createStore();
reactUseRedux(react);
react.render();
