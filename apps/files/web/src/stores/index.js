var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var constants = require('../constants');
var events = require('../constants/events.js');
var actions = require('../actions');
var assign = require('object-assign');

var api = require('../api.js');

var _state = {};

var store = assign({}, EventEmitter.prototype, {
    emitChange: function emitChange () {
        this.emit(events.CHANGE);
    },
    addChangeListener: function addChangeListener (callback) {
        this.on(events.CHANGE, callback);
    },
    removeChangeListener: function removeChangeListener (callback) {
        this.removeListener(events.CHANGE, callback);
    },
    getViewerState: function getViewerState () {
        return _state.viewer;
    },
    getUploaderState: function getUploadState () {
        return _state.uploader;
    },
    getSidebarState: function getSidebarState () {
        return _state.sidebar;
    },
    updateFolders: function updateFolders () {
        var isEqual = _state.viewer.path === _state.sidebar.path;
        window.socket.emit('filesystem:folder:get', _state.viewer.path, function (err, data) {
            if (!err) {
                _state.viewer.folders = data.folders;
                _state.viewer.files = data.files;
                if (isEqual) {
                    _state.sidebar.folders = data.folders;
                    _state.sidebar.files = data.files;
                }
                store.emitChange();
            } else {
                console.error('filesystem:folder:get', _state.viewer.path, err);
                _state.history.entries = _state.history.entries.slice(0, _state.history.pointer);
                _state.history.pointer--;
                _state.viewer.path = _state.history.entries[_state.history.pointer];
                store.emitChange();
            }
            if (!isEqual) {
                window.socket.emit('filesystem:folder:get', _state.sidebar.path, function (err, data) {
                    if (!err) {
                        _state.sidebar.folders = data.folders;
                        _state.sidebar.files = data.files;
                        store.emitChange();
                    } else {
                        console.error('filesystem:folder:get', _state.viewer.path, err, data);
                    }
                });
            }
        });
    },
    purge: function purge () {
        _state = {
            viewer: {
                path: '/',
                folders: [],
                files: []
            },
            sidebar: {
                path: '/',
                folders: [],
                files: []
            },
            uploader: {
                show: false,
                files: {},
                uploading: {}
            },
            history: {
                entries: [],
                pointer: 0
            }
        };
        store.emitChange();
    }
});

// fill store
store.purge();

// listen for changes
dispatcher.register(function (action) {
    console.log('store', action);
	switch (action.type) {
		case constants.CHANGE_FOLDER:
            // remove old history
            if (_state.history.pointer !== _state.history.entries.length) {
                var entries = _state.history.entries;
                var pointer = _state.history.pointer;
                _state.history.entries = [];
                for (var i = 0; i < pointer; i++) {
                    _state.history.entries.push(entries[i]);
                }
                _state.history.pointer = pointer;
            }
            // add to history
            _state.history.entries.push(_state.viewer.path);
            _state.history.pointer++;
            // change path
            _state.viewer.path = action.path;
            store.updateFolders();
		break;
        case constants.HISTORY_BACK:
            // add current path if this is the first step back
            if (_state.history.pointer === _state.history.entries.length) {
                _state.history.entries.push(_state.viewer.path);
            }
            // go one step back
            if (_state.history.pointer) {
                _state.history.pointer--;
                _state.viewer.path = _state.history.entries[_state.history.pointer];
                store.updateFolders();
            }
        break;
		case constants.HISTORY_FORWARD:
            if (_state.history.pointer + 1 < _state.history.entries.length) {
                _state.history.pointer++;
                _state.viewer.path = _state.history.entries[_state.history.pointer];
                store.updateFolders();
            }
		break;
        case constants.UPDATE_FOLDER:
            store.updateFolders();
        break;
        case constants.DELETE_FOLDER:
            window.socket.emit('filesystem:folder:delete', action.path, function (err, data) {
                console.log('filesystem:folder:delete', action.path, err, data);
                store.updateFolders();
            });
        break;
        case constants.OPEN_FILE:
            window.open('https://files.dode.keract/files' + action.path);
        break;
        case constants.DOWNLOAD_FILE:
            window.socket.emit('filesystem:file:get', action.path, function (err, data) {
                console.log(err, data);
            });
        break;
        case constants.DELETE_FILE:
            window.socket.emit('filesystem:file:delete', action.path, function (err, data) {
                console.log('filesystem:file:delete', action.path, err, data);
                store.updateFolders();
            });
        break;
        case constants.RENAME_FILE:
            window.socket.emit('filesystem:file:rename', action.path, action.newPath, function (err, data) {
                console.log('filesystem:file:rename', action.path, action.newPath, err, data);
                store.updateFolders();
            });
        break;
        case constants.CREATE_FOLDER:
            window.socket.emit('filesystem:folder:create', action.path, function (err, data) {
                console.log('filesystem:folder:create', err, data);
                store.updateFolders();
            });
        break;
        case constants.RENAME_FOLDER:
            window.socket.emit('filesystem:folder:rename', action.path, action.newPath, function (err, data) {
                console.log('filesystem:folder:rename', action.path, action.newPath, err, data);
                store.updateFolders();
            });
        break;
        case constants.ADD_FILES_TO_UPLOAD:
            for (var i = 0; i < action.files.length; i++) {
                var id = window.generateUUID();
                _state.uploader.files[id] = {
                    file: action.files[i],
                    name: action.files[i].name,
                    size: action.files[i].size
                };
                _state.uploader.path = _state.viewer.path;
            }
            if (action.files.length) {
                _state.uploader.show = true;
            }
            store.emitChange();
        break;
        case constants.ABORT_FILE_UPLOAD:
            _state.uploader.files = [];
            _state.uploader.show = false;
            store.emitChange();
        break;
        case constants.UPLOAD_FILES:
            var files = _state.uploader.files;
            console.log('uploading', files.length, 'files');
            for (var i in files) {
                (function () {
                    var file = files[i].file;
                    var id = window.generateUUID();
                    var currentFile = {
                        blobStream: api.uploadFile({
                            file: files[i].file,
                            name: files[i].name,
                            path: _state.uploader.path
                        }),
                        progress: 0,
                        name: files[i].name
                    };
                    var size = 0;
                    currentFile.blobStream.on('data', function (chunk) {
                        size += chunk.length;
                        _state.uploader.uploading[id].progress = Math.floor(size / file.size * 100);
                        store.emitChange();
                    });
                    currentFile.blobStream.on('end', function () {
                        delete _state.uploader.uploading[id];
                        store.updateFolders();
                    });
                    _state.uploader.uploading[id] = currentFile;
                })()
            }
            _state.uploader.files = {};
            _state.uploader.show = false;
            console.log(_state.uploader);
            store.emitChange();
        break;
        case constants.DELETE_UPLOAD_ITEM:
            delete _state.uploader.files[action.id];
            store.emitChange();
        break;
	}
});

module.exports = store;
