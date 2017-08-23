import {EUploadType} from "../../package";
import {UploadBase} from "./base";
import {UploadFiles} from "./upload-file";
import {UploadImages} from "./upload-image";

const file = new UploadFiles();
const image = new UploadImages();

export function switchDatabase(type: EUploadType): UploadBase<any> {
	switch (type) {
	case EUploadType.file:
		return file;
	case EUploadType.image:
		return image;
	default:
		throw new TypeError(`unknown database: ${type}`);
	}
}
