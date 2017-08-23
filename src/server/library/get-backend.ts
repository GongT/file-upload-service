import {BackendOptions, EBackendType, StorageBackendCreator} from "./backend";
import {OSSBackend} from "./oss.backend";
import {S3Backend} from "./s3.backend";

export function getBackend(type: EBackendType, options: BackendOptions) {
	let Construct: StorageBackendCreator;
	switch (type) {
	case EBackendType.oss:
		Construct = OSSBackend;
		break;
	case EBackendType.aws:
		Construct = S3Backend;
		break;
	default:
		throw new Error(`unknown cdn type: ${type}`);
	}
	
	return new Construct(options);
}
