import {BaseComponent, BindThis} from "@gongt/ts-stl-client/react/stateless-component";
import {
	ActionTrigger,
	CANCEL_TRIGGER,
	ReactReduxConnector,
	TDispatchProps,
} from "@gongt/ts-stl-client/redux/react-connect";
import * as React from "react";
import {AppState} from "../";
import {MetaInput} from "../components/meta-input";
import {BS3PanelForm} from "../panel";
import {RequestAction, RequestHandler} from "../redux/request-handler";

interface IProps extends TDispatchProps {
	meta?: object;
	file?: File;
}

const conn = new ReactReduxConnector<AppState, IProps>();
conn.addMapper((state) => {
	return {
		meta: state.MetaContent.data,
		file: state.CurrentFile.file,
	};
});

@conn.connect
export class TestFullUpload extends BaseComponent<IProps> {
	@BindThis
	@ActionTrigger(RequestAction, RequestHandler)
	onSubmit(e) {
		e.preventDefault();
		if (!this.props.meta) {
			alert('input json data error.');
			return CANCEL_TRIGGER;
		}
		if (!this.props.file) {
			alert('no file selected.');
			return CANCEL_TRIGGER;
		}
		
		return {
			api: 'simpleUploadFile',
			args: [this.props.file, this.props.meta],
		};
	}
	
	render() {
		return <BS3PanelForm id="fullUpload"
			styleClass='default'
			title="完整上传逻辑"
			onSubmit={this.onSubmit}
		>
			<MetaInput/>
		</BS3PanelForm>
	}
}
