let fileObject: {file: HTMLInputElement, reject: Function};

function destroy(file: HTMLInputElement) {
	document.body.removeChild(file);
	if (file && fileObject.file !== file) {
		return;
	}
	fileObject.reject();
	fileObject = null;
}

export function createInputField(): Promise<File> {
	if (typeof window !== 'object') {
		throw new TypeError(`Can't use headless upload on server.`);
	}
	if (typeof event !== 'object') {
		throw new TypeError(`headless upload must call during click callback.`);
	}
	
	const file: HTMLInputElement = <any> document.createElement('INPUT');
	file.setAttribute('type', 'file');
	file.style.display = 'none';
	
	if (fileObject) {
		fileObject.reject();
	}
	
	document.body.appendChild(file);
	const p: Promise<any> = new Promise((resolve, reject) => {
		file.addEventListener('change', () => {
			if (file.files && file.files[0]) {
				resolve(file.files[0]);
			} else {
				reject();
			}
		});
		
		file.click();
		fileObject = {file, reject};
	});
	p.then(() => {
		destroy(file);
	}, () => {
		destroy(file);
	});
	return p;
}
