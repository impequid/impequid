// require internal
var db = require('../db');
var crypt = require('../crypto');

function register (socket, data, callback) {
	if (!data || !(data.secret && data.password && data.username && data.email)) {
		callback(true);
	} else if ((data.secret === 'cyka' && data.password.length >= 8)) {
		var hashed = crypt.createPassword(data.password);
		db.models.User.create({
			username: data.username,
			password: hashed.password,
			email: data.email,
			salt: hashed.salt
		}, function (err) {
			if (!err) {
				callback(null, true);
			} else {
				callback(true);
			}
		});
	} else {
		callback(true);
	}
}

function login (socket, data, callback) {
	if (data && data.email && data.password) {
		db.models.User.findOne({email: data.email}, 'password salt username _id', function(err, user) {
			if (!user) {
				callback(true, false);
			} else {
				if (crypt.checkPassword(data.password, user.password, user.salt)) {
                    socket.handshake.session.loggedIn = true;
                    socket.handshake.session.user = {
                        username: user.username,
                        email: data.email,
						id: user._id
                    };
                    socket.handshake.session.save();
                    callback(null, true);
				} else {
                    callback(true, false);
				}
			}
		});
	} else {
		callback(true);
	}
}

function logout (socket, callback) {
    delete socket.handshake.session.loggedIn;
	delete socket.handshake.session.user;
	socket.handshake.session.save();
	callback(null, true);
}

function verify (socket, callback) {
	if (socket.handshake.session.loggedIn) {
		callback(null, socket.handshake.session.user);
	} else {
		callback(true, null);
	}
}

module.exports = {
    login: login,
    logout: logout,
    register: register,
    verify: verify
}
