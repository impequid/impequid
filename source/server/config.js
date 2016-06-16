const config = {
	listenAddress: '0.0.0.0',
	port: 44400,
	session: {
		"keys": ["secret", "key"],
		duration: 86400 * 90
	},
	"reCaptcha": {
		"secret": "",
		"public": ""
	},
	mongo: {
		url: 'mongodb://'
	},
	serverName: 'default impequid server'
};

export default config;
