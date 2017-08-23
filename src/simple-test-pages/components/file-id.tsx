import {BaseComponent, BindThis} from "@gongt/ts-stl-client/react/stateless-component";
import {ActionTrigger, ReactReduxConnector, TDispatchProps} from "@gongt/ts-stl-client/redux/react-connect";
import * as React from "react";
import {AppState} from "../index";
import {FileIdAction, FileIdStore, IFileIdProps, selectFileIdResult} from "../redux/file-id";

const conn = new ReactReduxConnector<AppState, IFileIdProps&TDispatchProps>();
conn.addMapper(selectFileIdResult);

@conn.connect
export class FileIdDisplay extends BaseComponent<IFileIdProps&TDispatchProps> {
	@BindThis
	@ActionTrigger(FileIdAction, FileIdStore)
	private onChange(e) {
		const v = e.target.value;
	};
	
	render() {
		return <input
			type="text"
			placeholder="文件ID"
			name="id"
			onChange={this.onChange}
			value={this.props.fileId}
			className="form-control"
		/>
	}
}
