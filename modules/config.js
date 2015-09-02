var path = require('path');

module.exports = {
	root: path.resolve(__dirname + '../..'),
	https: {
		port: 8443
	},
	http: {
		port: 8080
	},
	db: {
		main: 'mongodb://server/impequid'
	},
	sessions: {
		"secret": "cykablyatidinahui",
		"resave": true,
		"saveUninitialized": true
	},
	crypto: {
		pepper: 'cykablyatidinahui'
	},
	host: {
		name: 'dodekeract.report'
	},
	tokens: {
		time: 60000
	},
	apps: {
		path: 'apps'
	},
	tests: {
		domain: 'localhost:8080',
		port: 8080
	}
}
