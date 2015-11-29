var constants = require('../constants').notification;
var events = require('../constants').notificationEvents;
var dispatcher = require('../dispatcher').notification;

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var _state = {};

var store = assign({}, EventEmitter.prototype, {
	emitChange: function emitChange () {
		this.emit(events.CHANGE);
	},
	addChangeListener: function addChangeListener (callback) {
		this.on(events.CHANGE, callback);
	},
	removeChangeListener: function removeChangeListener (callback) {
		this.removeChangeListener(events.CHANGE, callback);
	},
	getState: function getState () {
		return _state;
	},
	purge: function purge () {
		_state = {

		};
		store.emitChange();
	}
});

// fill store
store.purge();

dispatcher.register(function (action) {
	console.log('mainStore-notification.js', action);
	switch (action.type) {
		case 'NEW_NOTIFICATION':
			var n = new Notification('Hello world!', {
				body: 'This is not a test.',
				icon: 'images/icon.png'
			});
		break;
	}
});

// handle notifications
function notifyMe() {
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notifications.");
	} else if (Notification.permission === "granted") {
		console.info('Notifications enabled.');
	} else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function (permission) {
			if (permission === "granted") {
				console.info('Notifications enabled');
			}
		});
	} else {
		console.error('Notifications denied.');
	}
}

// notifyMe();
// var n = new Notification('Hello world!', {
// 	body: 'This is not a test.',
// 	icon: 'images/icon.png'
// });

module.exports = store;
