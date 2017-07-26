import * as React from "react";
import {MetaInput} from "../meta-input";
import {BS3PanelForm} from "../panel";
import {testContext} from "../share-variables";
import {FileIdDisplay} from "./file-id-display.inc";

export class TestEditFile extends React.Component<{}, undefined> {
	static contextTypes = testContext;
	
	onSubmit(e) {
		e.preventDefault();
		alert('not impl');
		
		if (!this.context.shareFile || !this.context.shareFile._id) {
			return alert('no current file.');
		}
		
		/*
		const p = this.context.api.update(this.context.shareFile._id, 'test');
		this.context.handlePromise(p);
		*/
	}
	
	render() {
		return <BS3PanelForm id="editFile"
			title="修改文件附加信息"
			onSubmit={this.onSubmit.bind(this)}
		>
			<FileIdDisplay />
			<MetaInput />
		</BS3PanelForm>
	}
}
