
export type FetchApi = (...args: any[]) => Promise<any>;

let _fetch: FetchApi;
if (typeof window === 'object') {
	require("whatwg-fetch");
	_fetch = window['fetch'].bind(undefined);
} else {
	_fetch = (void 0 || require)('node-fetch');
}

export const fetch: FetchApi = _fetch;
