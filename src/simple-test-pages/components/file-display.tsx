import {BaseComponent} from "@gongt/ts-stl-client/react/stateless-component";
import {ReactReduxConnector, TDispatchProps} from "@gongt/ts-stl-client/redux/react-connect";
import * as React from "react";
import {AppState} from "../";
import {FileProperty} from "../redux/current-file";

export interface IProps extends TDispatchProps {
	error?: Error;
	prop?: FileProperty
	hash?: string;
}

const c = new ReactReduxConnector<AppState, IProps>();
c.addMapper((state) => {
	return {
		error: state.CurrentFile.error,
		prop: state.CurrentFile.prop,
		hash: state.CurrentFile.hash,
	};
});

@c.connect
export class FileDisplay extends BaseComponent<IProps> {
	render() {
		if (this.props.prop) {
			return <div>
				<pre>{JSON.stringify(this.props.prop, null, 4)}</pre>
				<pre>{this.props.error
					? this.props.error.message
					: this.props.hash || 'calculating...'}</pre>
			</div>
		} else {
			return <div>
				<pre>no file selected</pre>
			</div>
		}
	}
}
