let customConfig;

try {
	customConfig = require('../../config.json');
} catch (error) {
	console.error('could not load config.json');
	customConfig = {};
}

const config = Object.assign({
	listen: {
		address: '127.0.0.1',
		port: 50000
	},
	session: {
		"keys": [],
		duration: 86400 * 90
	},
	"reCaptcha": {
		"secret": "",
		"public": ""
	},
	mongo: {
		url: 'mongodb://127.0.0.1/impequid',
		debug: false
	},
	server: {
		domain: "example.domain",
		name: "Impequid Server"
	},
	serviceProvider: {
		url: 'https://services.impequid.com',
		cache: true
	}
}, customConfig);

export default config;
