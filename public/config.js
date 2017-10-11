SystemJS.config({
	baseURL: '/public',
	paths: {
		'tester/': 'tester/'
	},
	packages: {
		'tester': {
			'main': 'index.js'
		}
	}
});

SystemJS.config({
	packageConfigPaths: [],
	map: {},
	packages: {}
});
