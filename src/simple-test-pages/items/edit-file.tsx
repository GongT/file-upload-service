import {BaseComponent, BindThis} from "@gongt/ts-stl-client/react/stateless-component";
import {
	ActionTrigger, CANCEL_TRIGGER, ReactReduxConnector,
	TDispatchProps,
} from "@gongt/ts-stl-client/redux/react-connect";
import * as React from "react";
import {AppState} from "../";
import {MetaInput} from "../components/meta-input";
import {BS3PanelForm} from "../panel";
import {IFileIdProps, selectFileIdResult} from "../redux/file-id";
import {RequestAction, RequestHandler} from "../redux/request-handler";
import {FileIdDisplay} from "../components/file-id";

export interface IProps extends TDispatchProps, IFileIdProps {
}

const conn = new ReactReduxConnector<AppState, IProps>();
conn.addMapper(selectFileIdResult);

@conn.connect
export class TestEditFile extends BaseComponent<IProps> {
	@BindThis
	@ActionTrigger(RequestAction, RequestHandler)
	onSubmit(e) {
		e.preventDefault();
		alert('not impl');
		
		if (!this.context.shareFile || !this.context.shareFile._id) {
			alert('input id first.');
			return CANCEL_TRIGGER;
		}
	}
	
	render() {
		return <BS3PanelForm id="editFile"
			title="修改文件附加信息"
			onSubmit={this.onSubmit.bind(this)}
		>
			<FileIdDisplay/>
			<MetaInput/>
		</BS3PanelForm>
	}
}
