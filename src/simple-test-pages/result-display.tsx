import * as React from "react";
import {BS3PanelForm} from "./panel";
import {testContext} from "./share-variables";

export class ResultDisplay extends React.Component<{}, undefined> {
	static contextTypes = testContext;
	
	render() {
		return <div style={{
			height: '250px',
			boxShadow: 'black 0 1px 17px 2px',
		}}>
			<div className="container" style={{
				position: 'fixed',
				height: '250px',
				overflow: 'scroll',
				bottom: '0',
				width: '100%',
				left: '0',
				background: 'white',
				boxShadow: 'black 0 3px 14px 1px',
			}}>
				<BS3PanelForm id="displayResult"
					styleClass={this.context.last_status === 0? 'success' : 'danger'}
					title="请求结果"
					style={{margin: '3px auto'}}
					button={false}
				>
					<pre>{JSON.stringify(this.context.last_result, null, 8)}</pre>
					{this.context.last_result && this.context.last_result.stack
						? <pre className="alert-danger">{this.context.last_result.stack}</pre>
						: undefined
					}
				</BS3PanelForm>
			</div>
		</div>
	}
}
