import * as React from "react";
import {testContext} from "./share-variables";

export class MetaInput extends React.Component<{}, any> {
	static contextTypes = testContext;
	static metaString = '';
	static metaStyle = 'default';
	
	parseMetaJson(text) {
		try {
			MetaInput.metaString = text;
			MetaInput.metaStyle = text? 'success' : 'default';
			if (!text) {
				text = '{}';
			}
			this.context.updateContext({
				meta: JSON.parse(text),
			});
		} catch (e) {
			MetaInput.metaStyle = 'error';
			this.context.updateContext({
				meta: null,
			});
		}
	}
	
	handleChange(e) {
		MetaInput.metaString = e.target.value;
		this.context.updateContext({});
	}
	
	render() {
		return <div className={`has-${MetaInput.metaStyle}`}>
			<textarea onBlur={(e: any) => this.parseMetaJson(e.target.value)}
				name="meta"
				placeholder="文件附加信息(json)(optional)"
				className="form-control"
				value={MetaInput.metaString}
				onChange={this.handleChange.bind(this)}
			/>
		</div>
	}
}
