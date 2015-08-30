// require external
var mongoose = require('mongoose');

// require internal
var config = require('./config');

var model = {};
mongoose.connect(config.db.main);

function init () {
	model.User = mongoose.model('User', {
		username: {type: String, unique: true, required: true, dropDubs: true, index: true},
		password: {type: String, required: true},
		email: {type: String, unique: true, required: true, dropDubs: true, index: true},
		salt: {type: String, required: true}
	});
}

module.exports = {
	init: init,
	model: model,
	mongoose: mongoose
};
