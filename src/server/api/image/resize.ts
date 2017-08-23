import {ApiRequest, ApiResponse} from "@gongt/ts-stl-library/request/protocol";
import {ERequestType} from "@gongt/ts-stl-library/request/request";
import {JsonApiHandler} from "@gongt/ts-stl-server/express/api-handler";
import {ValueChecker} from "@gongt/ts-stl-server/value-checker/value-checker";
import {FilePropertiesServer} from "../../../package/public-define";
import {UploadBase} from "../../database/base";
import {hashBuffer} from "../../library/helper/hash";

export interface CompleteRequest extends ApiRequest {
	id: string;
	width: string;
	height: string;
}

export interface CompleteResponse extends ApiResponse {
	resizeUrl: string;
}

const sharp = require('sharp');

export function resizeImageApi<T extends FilePropertiesServer>(model: UploadBase<T>) {
	const handler = new JsonApiHandler<CompleteRequest, CompleteResponse>(ERequestType.TYPE_GET, '/process/resize');
	handler.handleArgument('id').fromGet().filter(new ValueChecker().isString().isNotEmpty());
	handler.handleArgument('width').fromGet().filter(new ValueChecker().isString().isInt({min: 50, max: 1800}));
	handler.handleArgument('height').fromGet().filter(new ValueChecker().isString().isInt({min: 50, max: 1800}));
	handler.setHandler(async (context) => {
		const {id, width, height} = context.params;
		const file = await model.getById(id);
		if (!file) {
			throw new Error('no such file');
		}
		const buffer = await model.getFileBuffer(file);
		if (!buffer) {
			throw new Error('file not uploaded');
		}
		
		const img = sharp(buffer)
			.resize(parseInt(width), parseInt(height))
			.min()
			.crop(sharp.strategy.centre)
			.toFormat('png');
		const retBuff = await img.toBuffer();
		
		const hash = hashBuffer(retBuff);
		const resizedUrl = `/image-resize/${hash[0]}/${hash.substr(1)}.png`;
		
		const fileProps = await model.storage.saveGernerated({
			hash: hash,
			fileName: resizedUrl,
			buffer: retBuff,
			mimeType: 'image/png',
			meta: {
				generated: 'yes',
				service: 'image/resize',
			},
		});
		
		return {
			resizeUrl: fileProps.fetchUrl,
		};
	});
	return handler;
}
