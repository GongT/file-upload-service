import * as React from "react";
import {CSSProperties} from "react";

const maskPageStyle: CSSProperties = {
	position: 'fixed',
	zIndex: 999999,
	background: 'rgba(0,0,0,0.2)',
	left: 0,
	right: 0,
	bottom: 0,
	top: 0,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	textAlign: 'center',
};

export class MaskPage extends React.Component<{}, any> {
	render() {
		return <div style={maskPageStyle}>
			<h1 style={{color: 'black'}}>Loading</h1>
		</div>
	}
}
