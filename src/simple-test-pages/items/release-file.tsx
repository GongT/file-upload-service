import * as React from "react";
import {BS3PanelForm} from "../panel";
import {testContext} from "../share-variables";
import {FileIdDisplay} from "./file-id-display.inc";
import {testPost} from "./test-fetch";

export class TestReleaseFile extends React.Component<{}, undefined> {
	static contextTypes = testContext;
	
	onSubmit(e) {
		e.preventDefault();
		
		if (!this.context.fileId) {
			return alert('input id first.');
		}
		const p = testPost('/test/release', {
			fileId: this.context.fileId,
			holdName: this.name,
			holdId: this.id,
		});
		this.context.handlePromise(p);
	}
	
	render() {
		return <BS3PanelForm id="unreferFile"
			styleClass="default"
			onSubmit={this.onSubmit.bind(this)}
			title="删除文件">
			<FileIdDisplay />
			<input onChange={e => this.change('name', e.target.value)}
				type="text" name="ref_name" placeholder="引用的类型（数据表名）" className="form-control" autocomplete="off"/>
			<input onChange={e => this.change('id', e.target.value)}
				type="text" name="ref_id" placeholder="引用的ID（数据行_id）" className="form-control" autocomplete="off"/>
		</BS3PanelForm>
	}
	
	private id: string;
	private name: string;
	
	private change(s: 'name'|'id', value) {
		this[s] = value;
	}
}
