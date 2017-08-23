import {FilePropertiesClient} from "../public-define";

export const extendUrlGetter = {
	toUrl(this: FilePropertiesClient, internal: boolean): string {
		if (internal) {
			return this.urlInternal;
		} else {
			return this.url;
		}
	},
};

export interface FilePropertiesClientExtend extends FilePropertiesClient {
	toUrl(internal: boolean): string;
}
