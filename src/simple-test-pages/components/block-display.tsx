import * as React from "react";
import {ReactType} from "react";
import {BS3PanelForm} from "../panel";

interface IProps {
	title: string;
	style?: string;
	content: ReactType;
}

export class BlockDisplay extends React.Component<IProps, undefined> {
	render() {
		return <BS3PanelForm
			title={this.props.title}
			button={false}
			styleClass={this.props.style || 'default'}
		>{this.child()}</BS3PanelForm>
	}
	
	private child() {
		if (typeof this.props.content === 'string' || typeof this.props.content === 'number') {
			return <pre>{this.props.content}</pre>;
		} else if (this.props.content) {
			return <pre>{JSON.stringify(this.props.content, null, 8).replace(/\\n/g, '\n')}</pre>;
		} else {
			return <pre>{JSON.stringify(this.props.content, null, 8)}</pre>;
		}
	}
}
