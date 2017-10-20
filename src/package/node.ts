import {GlobalVariable} from "@gongt/ts-stl-library/pattern/global-page-data";
import {FileUploadPassingVar, UploadService} from "./index";

export function passOptionsToGlobal(g: GlobalVariable, uploader: UploadService) {
	g.set(FileUploadPassingVar, uploader.passToClient());
}

