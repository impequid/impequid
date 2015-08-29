// require internal
var db = require('../db');
var crypt = require('../crypto');

function handle (data, socket, callback) {
	if (data && data.email && data.password) {
		db.model.User.findOne({email: data.email}, 'password salt username email', function(err, user) {
			if (!user) {
				callback(true, false);
			} else {
				if (!(crypt.checkPassword(data.password, user.password, user.salt))) {
					callback(true, false);
				} else {
					socket.handshake.session.loggedIn = true;
					socket.handshake.session.userdata = {
						username: user.username,
						email: user.email
					};
					socket.handshake.session.save();
					callback(null, true);
				}
			}
		});
	} else {
		callback(true);
	}
}

module.exports = {
	handle: handle
}
