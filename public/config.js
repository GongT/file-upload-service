SystemJS.config({
	baseURL: '/public',
	paths: {
		'@gongt/file-upload-client/': 'self-package/',
		'tester/': 'tester/'
	},
	packages: {
		'tester': {
			'main': 'index.js'
		},
		'@gongt/file-upload-client': {
			'defaultExtension': 'js',
			'format': 'cjs',
			'main': 'index.js'
		}
	}
});

SystemJS.config({
	packageConfigPaths: [],
	map: {},
	packages: {}
});
