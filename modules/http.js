// include
var express = require('express');
var RouteHandler = new require('./utils').RouteHandler;

// prepare express
var app = express.Router();
var route = new RouteHandler(app);

// include routes
route.use({path: '/login', require: '../routes/login'});

// include static
app.use('/', express.static(__dirname + '/../' + 'web/dist'));

// export
module.exports = {
	app: app
};
