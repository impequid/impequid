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

// os
var osApp = require('./os.js');

//------------------------------apps------------------------------//

var mainApp = express();
var homeApp = express();
var staticApp = express();

//------------------------------vhost server------------------------------//

var forwarder = express();
	forwarder.all('*', function (req, res) {
		res.redirect('https://dodekeract.report' + req.url);
	});

var app = express();

	// enable addons

	app.use(compression());

	// main

	app.use(vhost('os.dode.keract', osApp));
	app.use(vhost('static.dode.keract', staticApp));
	app.use(vhost('*.dode.keract', forwarder));
	app.use(mainApp);

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
