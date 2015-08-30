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

//------------------------------apps------------------------------//

var osApp = require('./os.js');
var mainApp = express();
var homeApp = express();
var staticApp = express();
staticApp.use('*', function (req, res, next) {
	res.send('kek<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.js"></script>');
});

//------------------------------vhost server------------------------------//

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
	app.use(vhost('*.' + config.host.name, forwarder));
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
