var sioc = require('socket.io-client');
var config = require('../modules/config');
var Log = require('compact-log');
var log = new Log({
    levelMode: 'smartNoBrackets',
    clear: true
});

var socket = sioc.connect(config.host.name, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true
});

module.exports.createUser = function createUser () {
    socket.emit('session:register', {
        username: config.test.user.name,
        password: config.test.user.password,
        email: config.test.user.email,
        secret: config.sessions.password
    }, function (err, data) {
        log.debug(err, data);
    });
};

module.exports.log = log;
