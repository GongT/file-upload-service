import {FileUploadService} from "@gongt/file-upload-client/index";
import {sha256_file} from "@gongt/file-upload-client/sha256_extra";
import * as React from "react";
import {render} from "react-dom";
import {BlockDisplay} from "./block-display";
import {TestCheckFileComplete} from "./items/check-file-complete";
import {TestEditFile} from "./items/edit-file";
import {TestFullUpload} from "./items/full-upload";
import {TestGetFile} from "./items/get-file";
import {TestReferFile} from "./items/refer-file";
import {TestSignOnly} from "./items/sign-only";
import {TestUnreferFile} from "./items/unrefer-file";
import {TestUploadOnly} from "./items/upload-only";
import {MaskPage} from "./mask";
import {BS3PanelForm} from "./panel";
import {ResultDisplay} from "./result-display";
import {Row} from "./row";
import {testContext, TestingContext} from "./share-variables";

const service = new FileUploadService({
	projectName: 'self-test',
	debug: true,
	serverUrl: location.origin,
});

class RootComponent extends React.Component<any, any> {
	state = {
		busy: false,
	};
	
	static childContextTypes = testContext;
	private _last_context: TestingContext = {
		api: service,
		last_result: null,
		last_status: 0,
		sign: null,
		upload: null,
		complete: null,
		shareFile: null,
		fileObject: null,
		updateContext: this.updateContext.bind(this),
		handleResult: this.handleResult.bind(this),
		handlePromise: this.handlePromise.bind(this),
		fileId: '',
		meta: React.PropTypes.any,
	};
	
	updateContext(up) {
		// console.log('context change: %O', up);
		Object.assign(this._last_context, up);
		this.forceUpdate();
	}
	
	handleResult(success: boolean, res: any) {
		this.setState({busy: false});
		this.updateContext({
			last_result: res,
			last_status: success? 0 : 1,
		});
	}
	
	handlePromise(promise: Promise<any>) {
		this.setState({busy: true});
		promise.then(
			(data) => this.handleResult(true, data),
			(e) => this.handleResult(false, e),
		);
	}
	
	getChildContext(): TestingContext {
		return this._last_context;
	}
	
	fileChange(e) {
		const f = e.target.files[0];
		if (!f) {
			this.updateContext({
				fileObject: f,
				shareFile: null,
			});
			return;
		}
		const shareFile = {
			name: f.name,
			type: f.type,
			size: f.size,
			lastModified: f.lastModified,
			err: null,
			hash: null,
		};
		this.updateContext({
			fileObject: f,
			shareFile: shareFile,
		});
		const p = sha256_file(f).then((hash) => {
			shareFile.hash = hash;
			this.updateContext({
				fileObject: f,
				shareFile: shareFile,
			});
		}, (err) => {
			shareFile.err = err;
			this.updateContext({
				fileObject: f,
				shareFile: shareFile,
			});
		});
	}
	
	render() {
		return <div>
			<div className="container">
				<Row>
					<BS3PanelForm
						title="前置 - 选择文件"
						styleClass={this._last_context.fileObject? 'info' : 'warning'}
						button={false}
					>
						<input onChange={this.fileChange.bind(this)} type="file" name="file" className="form-control"/>
					</BS3PanelForm>
					<div>
						<pre>{JSON.stringify(this._last_context.shareFile, null, 4)}</pre>
						{this.state && this.state.busy? <div className="progress">
							<div className="progress-bar progress-bar-info progress-bar-striped" style={{width: '100%'}}></div>
						</div>
							: null}
					</div>
					<TestFullUpload />
				</Row>
				<Row>
					<BlockDisplay title="1. 签名" content={this._last_context.sign}/>
					<BlockDisplay title="2. 传文件" content={this._last_context.upload}/>
					<BlockDisplay title="3. 检查文件是否成功" content={this._last_context.complete}/>
				</Row>
				<Row>
					<TestSignOnly />
					<TestUploadOnly />
					<TestCheckFileComplete />
				</Row>
				<Row>
					<TestEditFile />
					<TestGetFile />
				</Row>
				<Row>
					<TestReferFile />
					<TestUnreferFile />
				</Row>
			</div>
			
			<ResultDisplay/>
			
			{this.state.busy? <MaskPage /> : null}
		</div>
	}
}

render<any>(
	<RootComponent />, document.querySelector('#reactRoot'),
);
