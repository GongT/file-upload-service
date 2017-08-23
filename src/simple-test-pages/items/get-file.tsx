import {BaseComponent, BindThis} from "@gongt/ts-stl-client/react/stateless-component";
import {
	ActionTrigger,
	CANCEL_TRIGGER,
	ReactReduxConnector,
	TDispatchProps,
} from "@gongt/ts-stl-client/redux/react-connect";
import * as React from "react";
import {AppState} from "../";
import {BS3PanelForm} from "../panel";
import {IFileIdProps, selectFileIdResult} from "../redux/file-id";
import {RequestAction, RequestHandler} from "../redux/request-handler";
import {FileIdDisplay} from "../components/file-id";

export interface IProps extends TDispatchProps, IFileIdProps {
}

const conn = new ReactReduxConnector<AppState, IProps>();
conn.addMapper(selectFileIdResult);

@conn.connect
export class TestGetFile extends BaseComponent<IProps> {
	@BindThis
	@ActionTrigger(RequestAction, RequestHandler)
	onSubmit(e) {
		e.preventDefault();
		
		if (!this.context.fileId) {
			alert('input id first.');
			return CANCEL_TRIGGER;
		}
		
		const p = this.context.api.fetchFile(this.context.fileId, 'test');
		this.context.handlePromise(p);
		p.then(ret => console.log(ret))
	}
	
	render() {
		return <BS3PanelForm id="getFile"
			styleClass="default"
			onSubmit={this.onSubmit.bind(this)}
			title="查询文件">
			<FileIdDisplay/>
		</BS3PanelForm>
	}
}
