import * as React from "react";
import {MetaInput} from "../meta-input";
import {BS3PanelForm} from "../panel";
import {testContext} from "../share-variables";

export class TestSignOnly extends React.Component<{}, any> {
	static contextTypes = testContext;
	
	onSubmit(e) {
		e.preventDefault();
		if (!this.context.meta) {
			return alert('input json data error.');
		}
		if (!this.context.fileObject) {
			return alert('no file selected.');
		}
		
		this.context.updateContext({
			signOk: false,
			sign: 'requesting',
		});
		
		const p = this.context.api.requestSignUrl(this.context.fileObject, this.context.meta);
		
		this.context.handlePromise(p);
		
		p.then((data) => {
			this.context.updateContext({
				signOk: true,
				sign: data,
			});
		}, (e) => {
			this.context.updateContext({
				signOk: false,
				sign: e,
			});
		});
	}
	
	render() {
		return <BS3PanelForm id="formSign"
			title="1. 签名"
			onSubmit={this.onSubmit.bind(this)}
		>
			<MetaInput />
		</BS3PanelForm>
	}
}
