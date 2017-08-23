export function slashEnd(str) {
	return str.replace(/([^\/])$/, '$1/');
}

export function noSlashStart(str) {
	return str.replace(/^\//g, '');
}
