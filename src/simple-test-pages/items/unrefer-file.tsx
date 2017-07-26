import * as React from "react";
import {BS3PanelForm} from "../panel";
import {FileIdDisplay} from "./file-id-display.inc";

export class TestUnreferFile extends React.Component<{},undefined> {
	render() {
		return <BS3PanelForm id="unreferFile"
			styleClass="default"
			title="删除文件（物理删除）">
			<FileIdDisplay />
			<input type="text" name="ref_name" placeholder="引用的类型（数据表名）" className="form-control"/>
			<input type="text" name="ref_id" placeholder="引用的ID（数据行_id）" className="form-control"/>
		</BS3PanelForm>
	}
}
