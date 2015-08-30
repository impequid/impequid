// require external
var sio = require('socket.io');

// require internal
var sharedSession = require('../sessions').shared;

// require socket routes
var session = require('./session');
var token = require('./token');

// set up log
var log = require('../log').createNamespace({
	name: 'socket'
});

// declare global variables
var io;

function init (servers) {
	// bind server
	io = sio();
	for (var i = 0; i < servers.length; i++) {
		io.attach(servers[i]);
	}

	// sessions
	io.use(sharedSession);

	// connection listener
	io.on('connection', function (socket) {
		var subdomain = socket.handshake.headers.host.split('.')[0];
		if (subdomain === 'os') { // private api
			socket.on('session:login', function (data, callback) {
				session.login(socket, data, callback);
			});
			socket.on('session:logout', function (callback) {
				session.logout(socket, callback);
			});
			socket.on('session:register', function (data, callback) {
				session.register(socket, data, callback);
			});
			socket.on('session:verify', function (callback) {
				session.verify(socket, callback);
			});
			socket.on('token:create', function (app, callback) {
				token.create(socket, app, callback);
			});
		} else { // public api
			// token
			socket.on('token:digest', function (possibleToken, callback) {
				token.digest(socket, possibleToken, callback);
				console.log('digest', socket.handshake.session);
			});
			// application
			socket.on('user:get', function (callback) {
				if(socket.handshake.session.user) {
					callback(null, socket.handshake.session.user.username);
				} else {
					callback('not authenticated');
				}
			});
		}
		socket.on('error', function (err) {
			log.error(err);
		});
	});
}

// export
module.exports = {
	init: init
};
