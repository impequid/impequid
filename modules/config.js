module.exports = {
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
	}
}
