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

function cleanPath (folder) {
    return path.join('/', folder);
}
var filesystemRoot = path.join(config.root, config.filesystem.path);

// core
var osApp = require('./os.js');

// apps

var appNames = fs.readdirSync(path.join(config.root, config.applications.path)).filter(function (file) {
	return fs.statSync(path.join(config.root, config.applications.path, file)).isDirectory();
});
var apps = {};

for (var i = 0; i < appNames.length; i++) {
	var name = appNames[i];
	apps[name] = {};
	apps[name].router = express.Router();
	apps[name].router.use(session);
	apps[name].router.use('/files/*', function (req, res) {
		if (req.session.user) {
			res.sendFile(path.join(filesystemRoot, req.session.user.id, cleanPath(req.params[0])));
		}
	});
	apps[name].router.use(express.static(path.join(config.root, config.applications.path, name , '/web/dist')));
}

// custom

var customNames = fs.readdirSync(path.join(config.root, config.custom.path)).filter(function (file) {
	return fs.statSync(path.join(config.root, config.custom.path, file)).isDirectory();
});
var custom = {};

for (var j = 0; j < customNames.length; j++) {
	var name = customNames[j];
	custom[name] = {};
	custom[name].router = require(path.join(config.root, config.custom.path, name));
	custom[name].router.use(express.static(path.join(config.root, config.custom.path, name, '/web/dist')));
}

// static files

var staticApp = express.Router();
staticApp.use(function(req, res, next) { // allow access from all origins
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
staticApp.use(express.static(path.join(config.root, '/web/static')));

// vhost

var forwarder = express.Router();
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

	// custom
	for (var j in custom) {
		if (j === 'main') {
			app.use(vhost(config.host.name, custom[j].router));
		}
		app.use(vhost(j + '.' + config.host.name, custom[j].router));
	}

	// wildcard

	app.use(vhost('*', forwarder));

// http
var httpServer = http.createServer(app).listen(config.http.port, function () {
	log.info('HTTP is running on port ' + config.http.port);
});

// https
var httpsServer = https.createServer({
	key: config.https.privateKey,
	cert: config.https.certificate
}, app).listen(config.https.port, function () {
	log.info('HTTPS is running on port ' + config.https.port);
});


// export
module.exports = {
	getServers: function () {
		return [httpServer, httpsServer];
	}
};
