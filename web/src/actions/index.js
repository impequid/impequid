var dispatcher = require('../dispatcher');
var constants = require('../constants');

var actions = {
	updateApplication: function updateApplication (name) {
		dispatcher.index.dispatch({
			type: constants.app.UPDATE_APPLICATION,
			name: name
		});
	},
	login: function login (event) {
		event.preventDefault();
		dispatcher.login.dispatch({
			type: constants.login.LOGIN
		});
	},
	changeEmail: function changeEmail (event) {
		dispatcher.login.dispatch({
			type: constants.login.CHANGE_EMAIL,
			email: event.target.value
		});
	},
	changePassword: function changePassword (event) {
		dispatcher.login.dispatch({
			type: constants.login.CHANGE_PASSWORD,
			password: event.target.value
		});
	},
	changeUsername: function changeUsername (event) {
		dispatcher.login.dispatch({
			type: constants.login.CHANGE_USERNAME,
			username: event.target.value
		});
	},
	register: function register (event) {
		event.preventDefault();
		dispatcher.login.dispatch({
			type: constants.login.REGISTER
		});
	},
	stepForward: function stepForward (event) {
		event.preventDefault();
		dispatcher.login.dispatch({
			type: constants.login.STEP_FORWARD
		});
	},
	stepBack: function stepBack () {
		dispatcher.login.dispatch({
			type: constants.login.STEP_BACK
		});
	}
};

module.exports = actions;
