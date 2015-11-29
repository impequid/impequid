var dispatcher = require('../dispatcher');
var constants = require('../constants');

var actions = {
	// folder
	createFolder: function createFolder (path) {
		dispatcher.dispatch({
			type: constants.CREATE_FOLDER,
			path: path
		});
	},
	changeFolder: function changeFolder (path) {
		dispatcher.dispatch({
			type: constants.CHANGE_FOLDER,
			path: path
		});
	},
	updateFolder: function updateFolder () {
		dispatcher.dispatch({
			type: constants.UPDATE_FOLDER
		});
	},
	deleteFolder: function deleteFolder (path) {
		dispatcher.dispatch({
			type: constants.DELETE_FOLDER,
			path: path
		});
	},
	renameFolder: function renameFolder (path, newPath) {
		dispatcher.dispatch({
			type: constants.RENAME_FOLDER,
			path: path,
			newPath: newPath
		});
	},
	// file
	deleteFile: function deleteFile (path) {
		dispatcher.dispatch({
			type: constants.DELETE_FILE,
			path: path
		});
	},
	renameFile: function renameFile (path, newPath) {
		dispatcher.dispatch({
			type: constants.RENAME_FILE,
			path: path,
			newPath: newPath
		});
	},
	downloadFile: function downloadFile (path) {
		dispatcher.dispatch({
			type: constants.DOWNLOAD_FILE,
			path: path
		});
	},
	openFile: function openFile (path) {
		dispatcher.dispatch({
			type: constants.OPEN_FILE,
			path: path
		});
	},
	abortFileUpload: function abortFileUpload () {
		dispatcher.dispatch({
			type: constants.ABORT_FILE_UPLOAD
		});
	},
	// files
	uploadFiles: function uploadFiles () {
		dispatcher.dispatch({
			type: constants.UPLOAD_FILES
		});
	},
	addFilesToUpload: function addFilesToUpload (files) {
		dispatcher.dispatch({
			type: constants.ADD_FILES_TO_UPLOAD,
			files: files
		});
	},
	deleteUploadItem: function deleteUploadItem (id) {
		dispatcher.dispatch({
			type: constants.DELETE_UPLOAD_ITEM,
			id: id
		});
	},
	history: {
		back: function back () {
			dispatcher.dispatch({
				type: constants.HISTORY_BACK
			});
		},
		forward: function forward () {
			dispatcher.dispatch({
				type: constants.HISTORY_FORWARD
			});
		}
	}
};

module.exports = actions;
