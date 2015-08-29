module.exports = {
	https: {
		port: 443
	},
	http: {
		port: 80
	},
	db: {
		main: 'mongodb://localhost'
	},
	sessions: {
		"secret": "cykablyatidinahui",
		"resave": true,
		"saveUninitialized": true
	},
	crypto: {
		pepper: 'cykablyatidinahui'
	}
}
