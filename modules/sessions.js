// require internal
var config = require('./config');
var db = require('./db');

// set up log
var log = require('./log').createNamespace({
	name: 'sessions'
});

// require external
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);

// update config.sessions
config.sessions.store = new MongoStore({
	mongooseConnection: db.mongoose.connection
});

var session = expressSession(config.sessions);
var sharedSession = require('express-socket.io-session')(session);

function verify (socket, callback) {
	log.debug(socket.handshake.session, socket.handshake.session.id);
	if(socket.handshake.session.loggedIn) {
		callback(null, socket.handshake.session.userdata);
	} else {
		callback(true, null);
	}
}

function auth(socket, target, callback, data) {
	if (socket.handshake.session.loggedIn) {
		if (data) {
			target(data, socket, callback);
		} else {
			target(socket, callback);
		}
	} else {
		callback(true);
	}
}

module.exports = {
	session: session,
	shared: sharedSession,
	verify: verify
};
