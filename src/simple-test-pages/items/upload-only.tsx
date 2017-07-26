import * as React from "react";
import {BS3PanelForm} from "../panel";
import {testContext} from "../share-variables";

export class TestUploadOnly extends React.Component<{}, undefined> {
	static contextTypes = testContext;
	
	onSubmit(e) {
		e.preventDefault();
		if (!this.context.signOk) {
			return alert('not signed.');
		}
		
		this.context.updateContext({
			upload: 'requesting',
			uploadOk: false,
		});
		
		const p = this.context.api.doUploadFile(this.context.sign, this.context.fileObject);
		
		this.context.handlePromise(p);
		
		p.then((data) => {
			this.context.updateContext({
				upload: data,
				uploadOk: true,
				fileId: data._id,
			});
		}, (e) => {
			this.context.updateContext({
				upload: e,
				uploadOk: false,
			});
		});
	}
	
	render() {
		return <BS3PanelForm id="formUpload"
			onSubmit={this.onSubmit.bind(this)}
			styleClass="default"
			title="2. 传文件">
			<span style={{wordBreak: 'break-all'}}>{this.context.sign && this.context.sign.signedUrl}</span>
		</BS3PanelForm>
	}
}
