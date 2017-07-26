import * as React from "react";
import {BS3PanelForm} from "../panel";
import {testContext} from "../share-variables";

export class TestCheckFileComplete extends React.Component<{}, undefined> {
	static contextTypes = testContext;
	
	onSubmit(e) {
		e.preventDefault();
		if (!this.context.signOk) {
			return alert('not signed.');
		}
		
		this.context.updateContext({
			complete: 'requesting',
		});
		
		const p = this.context.api.completeUploadFile(this.context.sign);
		this.context.handlePromise(p);
		
		p.then((data) => {
			this.context.updateContext({
				complete: data,
			});
		}, (e) => {
			this.context.updateContext({
				complete: e,
			});
		});
		
		this.context.handlePromise(p);
	}
	
	render() {
		return <BS3PanelForm id="testComplete"
			onSubmit={this.onSubmit.bind(this)}
			title="3. 检查文件是否成功">
		</BS3PanelForm>
	}
}
