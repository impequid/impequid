var dispatcher = require('../dispatcher').main;
var constants = require('../constants').main;

var actions = {
	logout: function logout () {
		dispatcher.dispatch({
			type: constants.LOGOUT
		});
	},
	connect: function connect () {
		dispatcher.dispatch({
			type: constants.CONNECT
		});
	},
	handleDisconnect: function handleDisconnect () {
		dispatcher.dispatch({
			type: constants.HANDLE_DISCONNECT
		});
	},
	reconnect: function reconnect () {
		dispatcher.dispatch({
			type: constants.RECONNECT
		});
	}
};

module.exports = actions;
