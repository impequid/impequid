var EventEmitter = require('events').EventEmitter;

var dispatcher = require('../dispatcher').main;
var constants = require('../constants').main;
var events = require('../constants').mainEvents;
var actions = require('../actions/main');

var assign = require('object-assign');

var _state = {};
var _reconnect = {
	delay: 0
};

var store = assign({}, EventEmitter.prototype, {
	emitChange: function emitChange () {
		this.emit(events.CHANGE);
	},
	addChangeListener: function addChangeListener (callback) {
		this.on(events.CHANGE, callback);
	},
	removeChangeListener: function removeChangeListener (callback) {
		this.removeListener(events.CHANGE, callback);
	},
	purge: function purge () {
		_state = {};
		store.emitChange();
	}
});

// fill store
store.purge();

var url = location.protocol + '//' + location.host;

dispatcher.register(function (action) {
	console.log('mainStore', action);
	switch (action.type) {
		case constants.LOGOUT:
			window.socket.emit('session:logout', function (err, data) {
				console.log('session:logout', err, data);
				if (!err) {
					delete localStorage.impequidHasSession;
					location.href = '#/login';
				}
			});
		break;
		case constants.CONNECT:
			var routeRendered = false;
			console.log('trying to connect to ' + url);
			window.socket = io.connect(url, {
				reconnection: false
			});
			window.socket.on('connect', function () {
				$('.dimmer').dimmer('hide');
				console.info('socket connected');
				// verify login
				if (localStorage.impequidHasSession) {
					socket.emit('session:verify', function (err, data) {
						if (err) {
							console.info('not logged in');
							location.href = '#/login';
						} else {
							console.info('already logged in');
							if (location.href === '#/login' || location.href === '#/register') {
								location.href = '#/';
							}
						}
						if (!routeRendered) {
							routeRendered = true;
							window.renderRoute();
						}
					});
				} else {
					location.href = '#/login';
					if (!routeRendered) {
						routeRendered = true;
						window.renderRoute();
					}
				}
			});
			window.socket.on('disconnect', function () {
				actions.handleDisconnect();
			});
		break;
		case constants.HANDLE_DISCONNECT:
			$('.dimmer').dimmer('show');
			console.log('disconnected from ' + url);
			setTimeout(actions.reconnect, _reconnect.delay);
		break;
		case constants.RECONNECT:
			var request = $.get(url, function (data) {
				window.socket.connect();
				_reconnect.delay = 0;
			});
			request.fail(function () {
				console.info('Reconnect failed, trying again in ' + _reconnect.delay/1000 + ' seconds.');
				_reconnect.delay += 500;
				_reconnect.timeout = setTimeout(actions.reconnect, _reconnect.delay);
			});
		break;
	}
});

module.exports = store;
