var dispatcher = require('../dispatcher').index;
var EventEmitter = require('events').EventEmitter;
var constants = require('../constants').app;
var events = require('../constants').events;
var actions = require('../actions');
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
	application: {
		getState: function getState () {
			return _state.application;
		},
		addChangeListener: function addChangeListener (callback) {
			store.on(events.APPLICATION_CHANGE, callback);
		},
		removeChangeListener: function removeChangeListener (callback) {
			store.removeListener(events.APPLICATION_CHANGE, callback);
		},
		emitChange: function emitChange () {
			store.emit(events.APPLICATION_CHANGE);
		}
	},
	purge: function purge () {
		_state = {
			application: {
				token: false,
				host: false,
				port: false,
				name: false,
				loading: true
			}
		};
		store.application.emitChange();
	}
});

// fill store
store.purge();

dispatcher.register(function (action) {
	console.log('mainStore-index.js', action);
	switch (action.type) {
		case constants.UPDATE_APPLICATION:
			_state.application = {
				loading: true,
				host: false,
				port: false,
				token: false,
				name: action.name
			};
			store.application.emitChange();
			window.socket.emit('token:create', action.name, function (err, token) {
				console.log('token:create', err, token);
				if (!err) {
					_state.application = {
						host: location.hostname.substring(3),
						port: location.port || 443,
						token: token,
						name: action.name,
						loading: false
					};
					store.application.emitChange();
				} else {
					_state.application = {
						host: false,
						port: false,
						token: false,
						name: false,
						loading: false
					};
					store.application.emitChange();
				}
			});
		break;
	}
});

module.exports = store;
