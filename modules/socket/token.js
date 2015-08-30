var ShortTermMemory = require('short-term-memory');
var crypto = require('../crypto');
var config = require('../config');
var log = require('../log').createNamespace({
    name: 'socket-token'
});

var tokenStore = new ShortTermMemory(config.tokens.time);

function create (socket, app, callback) {
    var token = crypto.createToken();
    tokenStore.add(token, {
        app: app,
        user: socket.handshake.session.user,
        issued: new Date().getTime()
    });
    callback(null, token);
}

function digest (socket, possibleToken, callback) {
    var token = tokenStore.get(possibleToken);
    if (token !== false) {
        if (token.app === socket.handshake.headers.host.split('.')[0]) {
            socket.handshake.session.application = token.app;
            socket.handshake.session.user = token.user;
            socket.handshake.session.save();
            callback(null, true);
        } else {
            log.critical('token used for wrong application', token, socket.handshake.headers.host);
            callback('wrong application');
        }
    } else {
        callback('no such token');
    }
}

module.exports = {
    create: create,
    digest: digest
}
