import {EUploadType, ServiceOptions, UploadService} from "../index";
import {ServiceApi} from "../lib/fetch";

export class ImageProcessor {
	private options: ServiceOptions;
	private api: ServiceApi;
	
	constructor(service: UploadService) {
		this.options = service.getOptions();
		if (this.options.type !== EUploadType.image) {
			throw new TypeError('service is not image.');
		}
		this.api = service.getApiRef();
	}
	
	resizeWithin(id: string, width: number, height: number) {
		return this.api.request('get', 'process/resize', {id, width, height}).then((data) => {
			return {
				created: data.created,
				message: data.message,
				resizeUrl: data.resizeUrl,
			};
		});
	}
	
}
