import * as React from "react";
import {testContext} from "../share-variables";

export class FileIdDisplay extends React.Component<{}, undefined> {
	static contextTypes = testContext;
	
	private onchange(e) {
		const v = e.target.value;
		this.context.updateContext({
			fileId: v,
		});
	};
	
	render() {
		return <input
			type="text"
			placeholder="文件ID"
			name="id"
			onChange={this.onchange.bind(this)}
			value={this.context.fileId}
			className="form-control"
		/>
	}
}
