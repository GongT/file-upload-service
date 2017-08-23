import {BaseComponent} from "@gongt/ts-stl-client/react/stateless-component";
import {ReactReduxConnector, TDispatchProps} from "@gongt/ts-stl-client/redux/react-connect";
import * as React from "react";
import {BlockDisplay} from "../components/block-display";
import {AppState} from "../index";

export interface IProps extends TDispatchProps {
	status?: string;
	data?: any;
}

const conn = new ReactReduxConnector<AppState, IProps>();
conn.addMapper((state) => {
	if (state.RequestHandler.lastError) {
		return {
			data: state.RequestHandler.lastError,
			status: 'error',
		};
	} else if (state.RequestHandler.lastData) {
		return {
			data: state.RequestHandler.lastData,
			status: 'success',
		};
	} else {
		return {
			data: 'no request sent',
			status: 'default',
		};
	}
});

@conn.connect
export class ResultDisplay extends BaseComponent<IProps> {
	render() {
		return <div style={{
			height: '250px',
			boxShadow: 'black 0 1px 17px 2px',
		}}>
			<div className="container" style={{
				position: 'fixed',
				height: '250px',
				overflow: 'scroll',
				bottom: '0',
				width: '100%',
				left: '0',
				background: 'white',
				boxShadow: 'black 0 3px 14px 1px',
				padding: 12,
			}}>
				<BlockDisplay
					title="请求结果"
					content={this.props.data}
					style={this.props.status}
				/>
			</div>
		</div>
	}
}
