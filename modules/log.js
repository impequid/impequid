// require external
var Log = require('compact-log');
var path = require('path');

// require internal
var config = require('./config');

// set up compact-log
var log = new Log({
	path: path.join(__dirname, '..', '/log/'),
	clear: true,
	levelmode: 'debug'
});

// export log
module.exports = log;
