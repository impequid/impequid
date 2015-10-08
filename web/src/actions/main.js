var dispatcher = require('../dispatcher').main;
var constants = require('../constants').main;

var actions = {
	logout: function logout () {
		dispatcher.dispatch({
			type: constants.LOGOUT
		});
	}
};

module.exports = actions;
