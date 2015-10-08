// require
var express = require('express');

// database & http-server
var db = require('./modules/database');
var server = require('./modules/server');

// initialize socket.io
var wisp = require('./modules/socket');
wisp.init(server.getServers());
