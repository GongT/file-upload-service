import {BaseComponent} from "@gongt/ts-stl-client/react/stateless-component";
import {ReactReduxConnector, TDispatchProps} from "@gongt/ts-stl-client/redux/react-connect";
import * as React from "react";
import {CSSProperties} from "react";
import {AppState} from "../";

const maskPageStyle: CSSProperties = {
	position: 'fixed',
	zIndex: 999999,
	background: 'rgba(0,0,0,0.2)',
	left: 0,
	right: 0,
	bottom: 0,
	top: 0,
	flexDirection: 'column',
	justifyContent: 'center',
	textAlign: 'center',
};

const show = {
	display: 'flex',
};
const hide = {
	display: 'none',
};

export interface IProps extends TDispatchProps {
	show?: boolean;
}

const conn = new ReactReduxConnector<AppState, IProps>();
conn.addMapper((state) => {
	return {
		show: state.PageMask.show,
	};
});

@conn.connect
export class PageMask extends BaseComponent<IProps> {
	render() {
		const state = this.props.show? show : hide;
		return <div style={{...maskPageStyle, ...state}}>
			<h1 style={{color: 'black'}}>Loading</h1>
		</div>
	}
}
