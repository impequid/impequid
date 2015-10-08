var EventEmitter = require('events').EventEmitter;

var dispatcher = require('../dispatcher').main;
var constants = require('../constants').main;
var events = require('../constants').mainEvents;
var actions = require('../actions/main');

var assign = require('object-assign');

var _state = {};

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
	}
});

module.exports = store;
