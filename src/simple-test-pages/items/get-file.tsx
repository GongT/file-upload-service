import * as React from "react";
import {BS3PanelForm} from "../panel";
import {testContext} from "../share-variables";
import {FileIdDisplay} from "./file-id-display.inc";

export class TestGetFile extends React.Component<{}, undefined> {
	static contextTypes = testContext;
	
	onSubmit(e) {
		e.preventDefault();
		
		if (!this.context.fileId) {
			return alert('input id first.');
		}
		
		const p = this.context.api.fetchFile(this.context.fileId, 'test');
		this.context.handlePromise(p);
		p.then(ret => console.log(ret))
	}
	
	render() {
		return <BS3PanelForm id="getFile"
			styleClass="default"
			onSubmit={this.onSubmit.bind(this)}
			title="查询文件">
			<FileIdDisplay />
		</BS3PanelForm>
	}
}
