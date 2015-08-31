// require external
var mongoose = require('mongoose');

// require internal
var config = require('./config');

var models = {};
mongoose.connect(config.db.main);
var ObjectId = mongoose.Schema.ObjectId;

function init () {
	models.User = mongoose.model('User', {
		username: {type: String, unique: true, required: true, dropDubs: true, index: true},
		password: {type: String, required: true},
		email: {type: String, unique: true, required: true, dropDubs: true, index: true},
		salt: {type: String, required: true}
	});
	models.Folder = mongoose.model('Folder', {
		path: {type: String, unique: true, required: true, dropDubs: true, index: true},
		user: {type: ObjectId, required: true, index: true},
		files: {type: Array},
		folders: {type: Array}
	});
}

module.exports = {
	init: init,
	models: models,
	mongoose: mongoose
};
