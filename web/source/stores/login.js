var dispatcher = require('../dispatcher').login;
var EventEmitter = require('events').EventEmitter;
var constants = require('../constants').login;
var events = require('../constants').events;
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
	getState: function getState () {
		return _state;
	},
	purge: function purge () {
		_state = {
			email: {
				data: '',
				valid: false
			},
			password: {
				data: '',
				valid: false
			},
			username: {
				data: '',
				valid: false
			},
			steps: [
				{
					valid: false
				},{
					valid: false
				},{
					valid: false
				}
			],
			allValid: false,
			loading: false,
			error: false,
			step: 0,
			showErrors: false
		};
		store.emitChange();
	}
});

// fill store
store.purge();

dispatcher.register(function (action) {
	console.log('mainStore-login.js', action.type);
	switch (action.type) {
		case constants.CHANGE_EMAIL:
			_state.email.data = action.email;
			validify();
			store.emitChange();
		break;
		case constants.CHANGE_PASSWORD:
			_state.password.data = action.password;
			validify();
			store.emitChange();
		break;
		case constants.CHANGE_USERNAME:
			_state.username.data = action.username;
			validify();
			store.emitChange();
		break;
		case constants.LOGIN:
			_state.loading = true;
			window.socket.emit('session:login', {
				email: _state.email.data,
				password: _state.password.data
			}, function (err, data) {
				if (!err) {
					localStorage.impequidHasSession = true;
					location.href = '#/';
					store.purge();
				} else {
					_state.loading = false;
					_state.error = true;
					store.emitChange();
				}
			});
			store.emitChange();
		break;
		case constants.REGISTER:
			window.socket.emit('session:register', {
				email: _state.email,
				password: _state.password.data,
				username: _state.username.data,
				secret: prompt('Secret?')
			}, function (err, data) {
				if (!err) {
					socket.emit('login', {
						email: _state.email.data,
						password: _state.password.data
					}, function (err, data) {
						if (!err) {
							store.purge();
							localStorage.hasSession = true;
							location.href = '#/';
						} else {
							alert('login failed');
						}
					});
				} else {
					alert('registration failed')
				}
			});
		break;
		case constants.STEP_BACK:
			_state.step = (_state.step > 0) ? _state.step-1 : 0;
			_state.showErrors = false;
			store.emitChange();
		break;
		case constants.STEP_FORWARD:
			if (_state.step === 0) {
				if (isValid('email') && isValid('password')) {
					_state.step++;
					_state.showErrors = false;
					store.emitChange();
				} else {
					_state.showErrors = true;
					store.emitChange();
				}
			} else if (_state.step === 1) {
				if (isValid('username')) {
					_state.step++;
					_state.showErrors = false;
					store.emitChange();
				} else {
					_state.showErrors = true;
					store.emitChange();
				}
			}
		break;
	}
});

function validify () {
	// form data
	_state.email.valid = isValid('email');
	_state.password.valid = isValid('password');
	_state.username.valid = isValid('username');

	// steps
	_state.steps[0].valid = stepValid(0);
	_state.steps[1].valid = stepValid(1);
	_state.steps[2].valid = stepValid(2);

	// finished
	_state.allValid = isValid();
}

function isValid (key) {
	switch (key) {
		case 'email':
			var regex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
			return regex.test(_state.email.data);
		break;
		case 'username':
			return _state.username.data.length >= 4;
		break;
		case 'password':
			return _state.password.data.length >= 8;
		break;
		default:
			return _state.email.data.length > 0 && _state.username.data.length > 0 && _state.password.data.length >= 8;
	}
}

function stepValid (n) {
	switch (n) {
		case 0:
			return _state.email.valid && _state.password.valid;
		break;
		case 1:
			return _state.username.valid;
		break;
	}
}

module.exports = store;
