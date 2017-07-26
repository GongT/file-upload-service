import * as React from "react";
import {BS3PanelForm} from "./panel";
import {testContext} from "./share-variables";

export class BlockDisplay extends React.Component<{title: string, content: any},undefined> {
	static contextTypes = testContext;
	
	render() {
		return <BS3PanelForm
			title={this.props.title}
			button={false}
		>
			<pre>{JSON.stringify(this.props.content, null, 8)}</pre>
		</BS3PanelForm>
	}
}
