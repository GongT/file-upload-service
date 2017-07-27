export function testPost(url: string, params: object) {
	return fetch(url, {
		method: 'post',
		body: JSON.stringify(params),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	}).then((response) => {
		if (response.status === 200) {
			if (/\/json/.test(response.headers.get('content-type'))) {
				return response.json();
			} else {
				return response.text();
			}
		}
		throw {
			status: response.status,
			message: `http error: ${response.statusText}`,
		};
	}).then((data) => {
		if (data.status === 0) {
			return data;
		} else {
			throw data;
		}
	});
}
