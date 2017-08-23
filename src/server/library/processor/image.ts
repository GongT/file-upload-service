import {FileProcessor} from "./base";

const {Magic, MAGIC_MIME_TYPE} = require('mmmagic');
const magic = new Magic(MAGIC_MIME_TYPE);

export class ImageFileProcessor extends FileProcessor {
	async check(): Promise<any> {
		try {
			this.checkHash();
			await this.detectIsImage();
			return true;
		} catch (e) {
			this.warn('uploaded image file "%s" wrong, may retry: %s.', this.props._id, e.message);
			return false;
		}
	}
	
	private detectIsImage() {
		return new Promise((resolve, reject) => {
			magic.detect(this.buffer, (err, mime) => {
				if (err || !mime) {
					return reject(err || new Error('can not detect mime'));
				} else {
					this.sill('detected mime type is: %s', mime);
					
					// image/png == image/jpg  - not care
					if (mime.split('/')[0] === this.props.mime.split('/')[0]) {
						return resolve(mime);
					} else {
						return reject(new Error('file mime type not equal'));
					}
				}
			});
		});
	}
	
	public resizeImage() {
	
	}
}
