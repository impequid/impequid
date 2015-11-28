// require internal
var db = require('../database');
var config = require('../config');
var log = require('../log').createNamespace({
	name: 'socket-session'
});
var filesystem = require('../socket/filesystem');
var Notion = require('notion');

var notion = new Notion(db.connection, {
	pepper: config.crypto.pepper,
	passwordMin: config.crypto.passwordMin,
	passwordMax: config.crypto.passwordMax
});

function register (socket, data, callback) {
	if (data.secret === config.sessions.password) {
		notion.register(function (err, data) {
			if (!err) {
				filesystem.init(data._id.toString(), function (err, data) {
					if (!err) {
						return callback(null, true);
					} else {
						return callback(true);
					}
				});
			} else {
				return callback(true);
			}
		});
	} else {
		return callback(true);
	}
}

function login (socket, data, callback) {
	notion.login(socket.handshake.session, data.email, data.password, function (err, data) {
		if (!err) {
			return callback(null, true);
		} else {
			return callback(true);
		}
	});
}

function logout (socket, callback) {
    notion.logout(socket.handshake.session, function (err, data) {
		if (!err) {
			return callback(null, true);
		} else {
			return callback(true);
		}
	});
}

function verify (socket, callback) {
	notion.verify(socket.handshake.session, function (err, data) {
		if (!err ) {
			return callback(null, true);
		} else {
			return callback(true);
		}
	});
}

module.exports = {
    login: login,
    logout: logout,
    register: register,
    verify: verify
}
