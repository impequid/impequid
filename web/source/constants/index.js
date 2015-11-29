var fluxConstants = require('flux-constants');

module.exports = {
	app: fluxConstants([
		'UPDATE_APPLICATION'
	]),
	events: fluxConstants([
		'CHANGE',
		'APPLICATION_CHANGE'
	]),
	main: fluxConstants([
		'LOGOUT',
		'HANDLE_DISCONNECT',
		'CONNECT',
		'RECONNECT'
	]),
	mainEvents: fluxConstants([
		'CHANGE'
	]),
	login: fluxConstants([
		'LOGIN',
		'CHANGE_EMAIL',
		'CHANGE_PASSWORD',
		'CHANGE_USERNAME',
		'REGISTER',
		'STEP_BACK',
		'STEP_FORWARD'
	]),
	notification: fluxConstants([
		'SHOW_NOTIFICATION'
	]),
	notificationEvents: fluxConstants([
		'CHANGE'
	])
};
