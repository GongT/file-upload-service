import {BaseComponent, BindThis} from "@gongt/ts-stl-client/react/stateless-component";
import {ActionTrigger, ReactReduxConnector, TDispatchProps} from "@gongt/ts-stl-client/redux/react-connect";
import * as React from "react";
import {AppState} from "../index";
import {MetaChangeAction, MetaContent} from "../redux/meta-input";

export interface IProps extends TDispatchProps {
	content?: string;
	isOk?: boolean;
}

const conn = new ReactReduxConnector<AppState, IProps>();
conn.addMapper((state) => {
	return {
		content: state.MetaContent.content,
		isOk: state.MetaContent.isOk,
	};
});

@conn.connect
export class MetaInput extends BaseComponent<IProps> {
	@BindThis
	@ActionTrigger(MetaChangeAction, MetaContent)
	private handleChange(e) {
		return {
			content: e.target.value,
		};
	}
	
	render() {
		return <div className={this.props.isOk? 'has-default' : 'has-error'}>
			<textarea
				name="meta"
				placeholder="文件附加信息(json)(optional)"
				className="form-control"
				value={this.props.content}
				onChange={this.handleChange}
			/>
		</div>
	}
}
