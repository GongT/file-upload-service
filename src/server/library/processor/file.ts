import {FilePropertiesServer} from "../../../package/public-define";
import {FileProcessor} from "./base";

export class CommonFileProcessor extends FileProcessor {
	async check(): Promise<any> {
		try {
			this.checkHash();
			return true;
		} catch (e) {
			this.warn('uploaded common file "%s" wrong, may retry: %s.', this.props._id, e.message);
			return false;
		}
	}
}
