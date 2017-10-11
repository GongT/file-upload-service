import {ImageProcessor, UploadService} from "@gongt/file-upload-client/index";
import {VirtualStore} from "@gongt/ts-stl-client/redux/virtual-store";

const service = new UploadService({
	debug: true,
});

window['_debug_service'] = service;
window['_debug_image_processor'] = () => {
	return new ImageProcessor(service);
};

export class ServiceObject extends VirtualStore<UploadService> {
	defaultValue = service;
}

export interface IMaskChange {
	show: boolean;
}
