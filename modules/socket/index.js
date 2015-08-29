// require external
var sio = require('socket.io');

// require internal
var sharedSession = require('../sessions').shared;
var register = require('./register');
var login = require('./login');

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
		socket.on('login', function (data, callback) {
			log.debug(data);
			login.handle(data, socket, callback);
		});
		socket.on('logout', function (callback) {
			require('./logout')(socket, callback);
		});
		socket.on('register', function (data, callback) {
			register.handle(data, socket, callback);
		});
		socket.on('session:verify', function (callback) {
			require('../sessions').verify(socket, callback);
		});
	});
}

// export
module.exports = {
	init: init
};
