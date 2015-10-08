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
		'LOGOUT'
	]),
	mainEvents: fluxConstants([
		'CHANGE'
	])
};
