var fluxConstants = require('flux-constants');

module.exports = {
	main: fluxConstants([
		'UPDATE_NOTES',
		'OPEN_NOTE'
	]),
	mainEvents: fluxConstants([
		'CHANGE'
	])
};
