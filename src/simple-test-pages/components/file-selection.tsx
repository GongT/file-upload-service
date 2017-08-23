import {BaseComponent, BindThis} from "@gongt/ts-stl-client/react/stateless-component";
import {ActionTrigger, ReactReduxConnector, TDispatchProps} from "@gongt/ts-stl-client/redux/react-connect";
import * as React from "react";
import {AppState} from "../";
import {BS3PanelForm} from "../panel";
import {CurrentFile, FileChangeAction} from "../redux/current-file";

export interface IProps extends TDispatchProps {
	file?: File;
}

const c = new ReactReduxConnector<AppState, IProps>();
c.addMapper((state) => {
	return {
		file: state.CurrentFile.file,
	};
});

@c.connect
export class FileSelection extends BaseComponent<IProps> {
	@BindThis
	@ActionTrigger(FileChangeAction, CurrentFile)
	fileChange(e) {
		return {
			newFile: e.target.files[0],
		};
	}
	
	render() {
		return <BS3PanelForm
			title="前置 - 选择文件"
			styleClass={this.props.file? 'info' : 'warning'}
			button={false}
		>
			<input onChange={this.fileChange} type="file" name="file" className="form-control"/>
		</BS3PanelForm>
	}
}
