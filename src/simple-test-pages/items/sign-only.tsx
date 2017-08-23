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
import {SignAction, SignFailAction, SignHandler} from "../redux/sign";

export interface IProps extends TDispatchProps {
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
export class TestSignOnly extends BaseComponent<IProps> {
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
			api: 'requestSignUrl',
			args: [this.props.file, this.props.meta],
			success: SignAction,
			failed: SignFailAction,
			store: SignHandler,
		};
	}
	
	render() {
		return <BS3PanelForm id="formSign"
			title="1. 签名"
			onSubmit={this.onSubmit.bind(this)}
		>
			<MetaInput/>
		</BS3PanelForm>
	}
}
