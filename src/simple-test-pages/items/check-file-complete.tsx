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
import {CompleteAction, CompleteFailAction, CompleteHandler} from "../redux/complete";
import {RequestAction, RequestHandler} from "../redux/request-handler";

export interface IProps extends TDispatchProps {
	sign?: any;
}

const conn = new ReactReduxConnector<AppState, IProps>();
conn.addMapper((state) => {
	return {
		sign: state.SignHandler,
	};
});

@conn.connect
export class TestCheckFileComplete extends BaseComponent<IProps> {
	@BindThis
	@ActionTrigger(RequestAction, RequestHandler)
	onSubmit(e) {
		e.preventDefault();
		if (!this.props.sign) {
			alert('not signed.');
			return CANCEL_TRIGGER;
		}
		return {
			api: 'completeUploadFile',
			args: [this.props.sign],
			success: CompleteAction,
			failed: CompleteFailAction,
			store: CompleteHandler,
		};
	}
	
	render() {
		return <BS3PanelForm id="testComplete"
			onSubmit={this.onSubmit.bind(this)}
			title="3. 检查文件是否成功">
		</BS3PanelForm>
	}
}
