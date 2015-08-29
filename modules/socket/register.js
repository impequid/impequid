// require internal
var db = require('../db');
var crypt = require('../crypto');
var log = require('../log').createNamespace({
	name: 'socket-register'
});

function handle(data, socket, callback) {
	if (!data || !(data.secret && data.password && data.username && data.email)) {
		callback(true);
	} else if ((data.secret === 'cyka' && data.password.length >= 8)) {
		var hashed = crypt.createPassword(data.password);
		db.model.User.create({
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

module.exports = {
	handle: handle
};
