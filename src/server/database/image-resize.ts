import {DataModel} from "@gongt/ts-stl-server/database/mongodb";
import * as mongoose from "mongoose";
import {MyDocument} from "../../package/public-define";
import {MongoObj} from "./base";

const ImageResizeSchema: mongoose.SchemaDefinition = {
	imageId: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true,
	},
	resizeId: {
		type: String,
		required: true,
	},
	path: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
};

export interface IImageResizeQuery {
	imageId: string;
	resizeId: string;
}

export interface IImageResizeSchema extends IImageResizeQuery, MyDocument {
	path: string;
	url: string;
}

export class ImageResizeModel extends DataModel<MongoObj<IImageResizeSchema>> {
	protected createSchema() {
		return ImageResizeSchema;
	}
	
	checkHasResize(query: IImageResizeQuery) {
		return this.findOne(query);
	}
	
	uploadedImage({imageId, resizeId, path, url}: IImageResizeSchema) {
		const condition = {
			imageId: new mongoose.mongo.ObjectId(imageId),
			resizeId,
		};
		const insert = {
			path,
			url,
		};
		return this.model.update(condition, insert, {
			upsert: true,
			multi: false,
			setDefaultsOnInsert: true,
		}).exec();
	}
}
