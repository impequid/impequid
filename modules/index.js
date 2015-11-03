// require
var express = require('express');

// database & http-server
var db = require('./database');
var server = require('./server');

// initialize socket.io
var wisp = require('./socket');
wisp.init(server.getServers());
