var dispatcher = require('../dispatcher').index;
var constants = require('../constants').app;

var actions = {
	updateApplication: function updateApplication (name) {
		dispatcher.dispatch({
			type: constants.UPDATE_APPLICATION,
			name: name
		});
	}
};

module.exports = actions;
