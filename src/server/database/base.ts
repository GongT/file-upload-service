export type BasicTypes = typeof Function | typeof Boolean | typeof Number | typeof String | typeof Object | any;

export interface ObjectSchemaDefine {
	type: BasicTypes | ObjectSchema| (BasicTypes)[] | ObjectSchema[];
	max?: number;
	min?: number;
	default?: any;
	required?: boolean | string;
	get?: (val: any) => any;
	set?: (val: any) => any;
	index?: Object | boolean | string;
	unique?: boolean;
	enum?: any[];
}

export interface ObjectSchema {
	[id: string]: ObjectSchemaDefine;
}
