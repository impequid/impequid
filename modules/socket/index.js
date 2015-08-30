// require external
var sio = require('socket.io');

// require internal
var sharedSession = require('../sessions').shared;

// require socket routes
var session = require('./session');

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
		if (subdomain === 'os') {
			socket.on('session:login', function (data, callback) {
				session.login(data, socket, callback);
			});
			socket.on('session:logout', function (callback) {
				session.logout(socket, callback);
			});
			socket.on('session:register', function (data, callback) {
				session.register(data, socket, callback);
			});
			socket.on('session:verify', function (callback) {
				session.verify(socket, callback);
			});
		} else {
			socket.on('session:*', function (data, callback) {
				console.log(subdomain, 'not main subdomain');
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
