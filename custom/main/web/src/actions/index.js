var dispatcher = require('../dispatcher');
var constants = require('../constants');

module.exports = {
	connect: function connect () {
		dispatcher.dispatch({
			type: constants.CONNECT
		});
	}
};
