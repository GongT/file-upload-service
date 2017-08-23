export interface MyDocument {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IHolder {
	holder: string;
	relatedId: string;
}

export interface FileProperties extends MyDocument {
	url: string;
	urlInternal: string;
	mime: string;
	attachedData: {
		[name: string]: any;
	};
	fileHash: string,
	hasUploaded: boolean,
	error?: any,
}

export interface FilePropertiesServer extends FileProperties {
	holders: IHolder[];
}

export interface FilePropertiesClient extends FileProperties {
	holders: number;
}

export interface SignResult {
	uploadUrl: string;
	fetchUrl: string;
	fetchUrlInternal: string;
}

export interface SaveResult {
	fetchUrl: string;
	fetchUrlInternal: string;
}

export interface SignApiResult {
	complete: boolean;
	file: FilePropertiesClient;
	signedUrl?: string;
}
