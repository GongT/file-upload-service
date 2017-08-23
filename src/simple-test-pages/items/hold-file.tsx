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
import {testPost} from "./test-fetch";

export interface IProps extends TDispatchProps, IFileIdProps {
}

const conn = new ReactReduxConnector<AppState, IProps>();
conn.addMapper(selectFileIdResult);

@conn.connect
export class TestHoldFile extends BaseComponent<IProps> {
	@BindThis
	@ActionTrigger(RequestAction, RequestHandler)
	onSubmit(e) {
		e.preventDefault();
		
		if (!this.context.fileId) {
			alert('input id first.');
			return CANCEL_TRIGGER;
		}
		const p = testPost('/test/hold', {
			fileId: this.context.fileId,
			holdName: this.name,
			holdId: this.id,
		});
		return {
			promise: p,
		};
	}
	
	render() {
		return <BS3PanelForm id="referFile "
			styleClass="default"
			onSubmit={this.onSubmit}
			title="引用文件">
			<FileIdDisplay/>
			<input onChange={e => this.change('name', e.target.value)}
				type="text" name="ref_name" placeholder="引用的类型（数据表名）" className="form-control" autoComplete="off"/>
			<input onChange={e => this.change('id', e.target.value)}
				type="text" name="ref_id" placeholder="引用的ID（数据行_id）" className="form-control" autoComplete="off"/>
		</BS3PanelForm>
	}
	
	private id: string;
	private name: string;
	
	private change(s: 'name'|'id', value) {
		this[s] = value;
	}
}
