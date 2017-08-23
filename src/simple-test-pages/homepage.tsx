import {BaseComponent} from "@gongt/ts-stl-client/react/stateless-component";
import {ReactReduxConnector} from "@gongt/ts-stl-client/redux/react-connect";
import * as React from "react";
import {BlockDisplay} from "./components/block-display";
import {FileDisplay} from "./components/file-display";
import {FileSelection} from "./components/file-selection";
import {PageMask} from "./components/mask";
import {AppState} from "./index";
import {TestCheckFileComplete} from "./items/check-file-complete";
import {TestEditFile} from "./items/edit-file";
import {TestFullUpload} from "./items/full-upload";
import {TestGetFile} from "./items/get-file";
import {TestHoldFile} from "./items/hold-file";
import {TestReleaseFile} from "./items/release-file";
import {ResultDisplay} from "./items/result-display";
import {TestSignOnly} from "./items/sign-only";
import {TestUploadOnly} from "./items/upload-only";
import {selectCompleteResult} from "./redux/complete";
import {selectSignResult} from "./redux/sign";
import {selectUploadResult} from "./redux/upload";
import {Row} from "./row";

const disCon = new ReactReduxConnector<AppState, any>();

disCon.addMapper({
	sign: selectSignResult,
	upload: selectUploadResult,
	complete: selectCompleteResult,
});

export interface IProps {
	sign?: any;
	upload?: any;
	complete?: any;
}

@disCon.connect
export class RootComponent extends BaseComponent<IProps> {
	render() {
		return <div>
			<div className="container">
				<Row>
					<FileSelection/>
					<FileDisplay/>
					<TestFullUpload/>
				</Row>
				<Row>
					<BlockDisplay title="1. 签名" content={this.props.sign}/>
					<BlockDisplay title="2. 传文件" content={this.props.upload}/>
					<BlockDisplay title="3. 检查文件是否成功" content={this.props.complete}/>
				</Row>
				<Row>
					<TestSignOnly/>
					<TestUploadOnly/>
					<TestCheckFileComplete/>
				</Row>
				<Row>
					<TestEditFile/>
					<TestGetFile/>
				</Row>
				<Row>
					<TestHoldFile/>
					<TestReleaseFile/>
				</Row>
			</div>
			
			<ResultDisplay/>
			
			<PageMask/>
		</div>
	}
}
