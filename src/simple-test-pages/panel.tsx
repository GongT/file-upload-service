import * as React from "react";
import {CSSProperties} from "react";

interface PanelProps {
	id?: string;
	styleClass?: string;
	title: string|React.ReactNode;
	onSubmit?: Function;
	button?: string|boolean;
	style?: CSSProperties;
}

export class BS3PanelForm extends React.Component<PanelProps, {}> {
	callSubmit(e) {
		if (this.props.onSubmit) {
			this.props.onSubmit(e);
		}
		e.preventDefault();
	}
	
	render() {
		let btn;
		if (this.props.button !== false) {
			let btnTxt = this.props.button;
			if (btnTxt === true) {
				btnTxt = 'OK'
			}
			btn = <input type="submit" value={btnTxt} className="btn btn-primary"/>;
		}
		return <form
			onSubmit={this.callSubmit.bind(this)}
			id={this.props.id}
			className={`panel panel-${this.props.styleClass || 'default'}`}
		>
			<div className="panel-heading">{this.props.title}</div>
			<div className="panel-body">
				{this.props.children}
			</div>
			<div className="panel-footer">
				{btn}
			</div>
		</form>
	}
}
