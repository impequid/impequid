// require external
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var path = require('path');
var cors = require('cors');
var compression = require('compression');
var vhost = require('vhost');

// require internal
var config = require('../config');
var session = require('../sessions').session;

// set up log
var log = require('../log').createNamespace({
	name: 'HTTP',
	colors: ['bgYellowBright', 'black']
});

// import from main module
var root = process.mainModule.exports.root;

// core
var osApp = require('./os.js');

// apps

var appNames = fs.readdirSync(config.apps.path).filter(function(file) {
	return fs.statSync(path.join(config.apps.path, file)).isDirectory();
});
var apps = {};

for (var i = 0; i < appNames.length; i++) {
	var name = appNames[i];
	apps[name] = {};
	apps[name].router = express.Router();
	apps[name].router.use(express.static(path.join(root, config.apps.path, name , '/web/dist')));
}

var staticApp = express();
staticApp.use(express.static(path.join(root, '/web/static')));

// vhost

var forwarder = express();
	forwarder.all('*', function (req, res) {
		res.redirect('https://' + config.host.name + req.url);
	});

var app = express();

	// enable addons

	app.use(compression());

	// main

	app.use(vhost('os.' + config.host.name, osApp));
	app.use(vhost('static.' + config.host.name, staticApp));

	// apps
	for (var i in apps) {
		app.use(vhost(i + '.' + config.host.name, apps[i].router));
	}

	// wildcard

	// app.use(vhost('*.' + config.host.name, forwarder));

// http
httpServer = http.createServer(app).listen(config.http.port, function () {
	log.info('HTTP is running on port ' + config.http.port);
});

// redirect https to http
httpsServer = https.createServer({
	key: fs.readFileSync(root + '/ssl/private.key', 'utf8'),
	cert: fs.readFileSync(root + '/ssl/certificate.crt', 'utf8')
}, app).listen(config.https.port, function () {
	log.info('HTTPS is running on port ' + config.https.port);
});


// export
module.exports = {
	getServers: function () {
		return [httpServer, httpsServer];
	}
};
