var fluxConstants = require('flux-constants');

module.exports = fluxConstants([
	// folder
	'CREATE_FOLDER',
	'CHANGE_FOLDER',
	'UPDATE_FOLDER',
	'DELETE_FOLDER',
	'RENAME_FOLDER',
	// file
	'DELETE_FILE',
	'RENAME_FILE',
	'DOWNLOAD_FILE',
	'OPEN_FILE',
	// files
	'UPLOAD_FILES',
	// show
	'ADD_FILES_TO_UPLOAD',
	'ABORT_FILE_UPLOAD',
	'DELETE_UPLOAD_ITEM',
	// history
	'HISTORY_BACK',
	'HISTORY_FORWARD'
]);
