var dispatcher = require('../dispatcher').main;
var constants = require('../constants').main;

var actions = {
	updateNotes: function updateNotes () {
		dispatcher.dispatch({
			type: constants.UPDATE_NOTES
		});
	},
	openNote: function openNote (name) {
		dispatcher.dispatch({
			type: constants.OPEN_NOTE,
			name: name
		});
	}
};

module.exports = {
	main: actions
};
