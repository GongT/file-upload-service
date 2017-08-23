import {BaseComponent, BindThis} from "@gongt/ts-stl-client/react/stateless-component";
import {
	ActionTrigger,
	CANCEL_TRIGGER,
	ReactReduxConnector,
	TDispatchProps,
} from "@gongt/ts-stl-client/redux/react-connect";
import * as React from "react";
import {AppState} from "../index";
import {BS3PanelForm} from "../panel";
import {RequestAction, RequestHandler} from "../redux/request-handler";
import {UploadAction, UploadFailAction, UploadHandler} from "../redux/upload";

export interface IProps extends TDispatchProps {
	signedUrl?: string;
	sign?: any;
	fileObject?: File;
	complete?: any;
}

const conn = new ReactReduxConnector<AppState, IProps>();
conn.addMapper((state) => {
	return {
		sign: state.SignHandler,
		signedUrl: state.SignHandler && state.SignHandler.signedUrl,
		fileObject: state.CurrentFile.file,
		complete: state.SignHandler && state.SignHandler.complete,
	};
});

@conn.connect
export class TestUploadOnly extends BaseComponent<IProps> {
	@BindThis
	@ActionTrigger(RequestAction, RequestHandler)
	onSubmit(e) {
		e.preventDefault();
		if (!this.props.sign) {
			alert('not signed.');
			return CANCEL_TRIGGER;
		}
		
		return {
			api: 'doUploadFile',
			args: [this.props.sign, this.props.fileObject],
			success: UploadAction,
			failed: UploadFailAction,
			store: UploadHandler,
		};
	}
	
	render() {
		return <BS3PanelForm id="formUpload"
			onSubmit={this.onSubmit}
			styleClass="default"
			title="2. 传文件">
			<span style={{wordBreak: 'break-all'}}>
			{this.props.complete? '已经上传完成' : this.props.signedUrl}
			</span>
		</BS3PanelForm>;
	}
}
