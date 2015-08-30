var express = require('express');
var cors = require('cors');
var session = require('../sessions').session;

var root = process.mainModule.exports.root;

var whitelist = [
	'https://os.dodekeract.report'
];
var corsOptions = {
	origin: function (origin, callback) {
		var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
		callback(null, originIsWhitelisted);
	}
};
var app = express();

app.use(cors(corsOptions));

app.use(session);

// static files
app.use(express.static(root + '/web/dist'));

module.exports = app;