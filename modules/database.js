// require external
var mongoose = require('mongoose');

// require internal
var config = require('./config');
var log = require('./log').createNamespace({
	name: 'DATA',
	colors: ['bgYellowBright', 'black']
});
var gridFS; // fixes circular dependency

// global vars
var models = {};
var ObjectId = mongoose.Schema.ObjectId;

// set up mongoose
var connection = mongoose.createConnection(config.database.main);

// set up gridfs-stream
connection.once('open', function () {
	log.info('connected to MongoDB');
	if (!gridFS) gridFS = require('./grid-fs');
	gridFS.init(connection, mongoose.mongo);
});

models.Folder = connection.model('Folder', {
	path: {type: String, unique: true, required: true, dropDubs: true, index: true},
	user: {type: ObjectId, required: true, index: true},
	files: {type: Array},
	folders: {type: Array}
});

module.exports = {
	models: models,
	mongoose: mongoose,
	connection: connection
};
