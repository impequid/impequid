const defaultConfig = {
	listenAddress: '0.0.0.0',
	port: 44400,
	session: {
		"keys": [],
		duration: 86400 * 90
	},
	"reCaptcha": {
		"secret": "",
		"public": ""
	},
	mongo: {
		url: 'mongodb://localhost/impequid'
	},
	serverName: ''
};

let customConfig;

try {
	customConfig = require('../../config.json');
} catch (error) {
	console.error('could not load config.json');
	customConfig = {};
}

const config = Object.assign({}, defaultConfig, customConfig);

export default config;
