// require external
var express = require('express');
var db = require('./modules/db');
var server = require('./modules/server');

// initialize socket.io
var wisp = require('./modules/socket');
wisp.init(server.getServers());
