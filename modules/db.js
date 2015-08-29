// require external
var mongoose = require('mongoose');

// require internal
var config = require('./config');

var model = {};
mongoose.connect(config.db.main);

function init () {
	model.User = mongoose.model('User', {
		username: String,
		password: String,
		email: String,
		salt: String
	});
}

module.exports = {
	init: init,
	model: model,
	mongoose: mongoose
};
