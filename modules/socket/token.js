var crypto = require('../crypto');
var config = require('../config');
var log = require('../log').createNamespace({
    name: 'socket-token'
});

// short-time in-memory single-get storage
function Storage (time) {
    this.data = [];
    this.time = time;
}
Storage.prototype.add = function (key, value) {
    var that = this;
    this.data[key] = {
        value: value,
        timeout: setTimeout(function () {
            delete that.data[key];
        }, this.time)
    };
}

Storage.prototype.get = function (key) {
    if (this.data[key]) {
        var value = this.data[key].value;
        if (value) {
            delete this.data[key];
            return value;
        }
    } else {
        return false;
    }
}

var tokenStore = new Storage(config.tokens.time);

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
