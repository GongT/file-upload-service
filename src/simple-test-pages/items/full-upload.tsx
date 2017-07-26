import * as React from "react";
import {MetaInput} from "../meta-input";
import {BS3PanelForm} from "../panel";
import {testContext} from "../share-variables";

export class TestFullUpload extends React.Component<{}, any> {
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
			sign: null,
			upload: null,
			complete: null,
		});
		
		const p = this.context.api.simpleUploadFile(this.context.fileObject, this.state && this.context.meta);
		
		this.context.handlePromise(p);
		
		p.then((file) => {
			this.context.updateContext({
				shareFile: file,
				fileId: file._id,
			});
		});
	}
	
	render() {
		// const f = this.context.fileObject;
		return <BS3PanelForm id="fullUpload"
			styleClass={this.state? this.state.style : 'default'}
			title="完整上传逻辑"
			onSubmit={this.onSubmit.bind(this)}
		>
			<MetaInput />
		</BS3PanelForm>
	}
}
