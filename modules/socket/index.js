// require external
var sio = require('socket.io');
var sios = require('socket.io-stream');
var path = require('path');

// require internal
var sharedSession = require('../sessions').shared;
var config = require('../config');
var gridFS = require('../grid-fs.js');

// require socket routes
var session = require('./session');
var token = require('./token');
var filesystem = require('./filesystem');
var notifications = require('./notifications');

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
		if (subdomain === 'os' || config.whitelist && config.whitelist.indexOf(subdomain) !== -1) { // user api
			// session
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
			// token
			socket.on('token:create', function (app, callback) {
				token.create(socket, app, callback);
			});
		}
		if (subdomain !== 'os' || config.whitelist && config.whitelist.indexOf(subdomain) !== -1) { // application api
			// token
			socket.on('token:digest', function (possibleToken, callback) {
				token.digest(socket, possibleToken, callback);
			});
			// filesystem.folder
			socket.on('filesystem:folder:get', function (path, callback) {
				filesystem.getFolder(socket, path, callback);
			});
			socket.on('filesystem:folder:create', function (path, callback) {
				filesystem.createFolder(socket, path, callback);
			});
			socket.on('filesystem:folder:rename', function (path, newName, callback) {
				filesystem.renameFolder(socket, path, newName, callback);
			});
			socket.on('filesystem:folder:delete', function (path, callback) {
				filesystem.deleteFolder(socket, path, callback);
			});
			// filesystem.file
			socket.on('filesystem:file:get', function (path, callback) {
				filesystem.getFile(socket, path, callback);
			});
			socket.on('filesystem:file:rename', function (path, newPath, callback) {
				filesystem.renameFile(socket, path, newPath, callback);
			});
			socket.on('filesystem:file:delete', function (path, callback) {
				filesystem.deleteFile(socket, path, callback);
			});
			// notifications
			socket.on('notifications:show', function (options, callback) {
				notifications.show(socket, options, callback);
			});
		}

		// public api
		socket.on('user:get', function (callback) {
			if(socket.handshake.session.user) {
				callback(null, socket.handshake.session.user.username);
			} else {
				callback('not authenticated');
			}
		});

		// other
		socket.on('error', function (err) {
			log.error(err);
		});

		// socket.io-stream
		sios(socket).on('file', function (readStream, meta) {
			filesystem.createFile(socket, readStream, meta);
		});
	});
}

// export
module.exports = {
	init: init
};
