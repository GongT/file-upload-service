export interface MyDocument {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
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
	holders: IHolder[],
}

export interface IHolder {
	holder: string;
	relatedId: string;
}

export interface SignResult {
	uploadUrl: string;
	fetchUrl: string;
	fetchUrlInternal: string;
}

export interface SignApiResult {
	complete: boolean;
	file: FileProperties;
	signedUrl?: string;
}
