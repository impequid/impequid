// require external
var express = require('express');
var db = require('./modules/db')

// export
module.exports = {
	root: __dirname
};

// database
db.init();

// http(s) server
var server = require('./modules/server');

// initialize socket.io
var wisp = require('./modules/socket');
wisp.init(server.getServers());
