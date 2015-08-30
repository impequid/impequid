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

module.exports = {
	session: session,
	shared: sharedSession
};
