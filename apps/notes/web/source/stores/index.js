var EventEmitter = require('events').EventEmitter;

var assign = require('object-assign');

var dispatcher = require('../dispatcher').main;
var constants = require('../constants').main;
var events = require('../constants').mainEvents;
var actions = require('../actions').main;

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
    getState: function getState () {
        return _state;
    },
    getViewerState: function getViewerState () {
        return _state.viewer;
    },
    purge: function purge () {
        _state = {
			entries: [],
            viewer: {
                title: '',
                content: ''
            }
		};
        store.emitChange();
    }
});

// fill store
store.purge();

// listen for changes
dispatcher.register(function (action) {
    console.log('notesStore', action);
	switch (action.type) {
		case constants.UPDATE_NOTES:
            window.socket.emit('filesystem:folder:get', '/documents/notes', function (err, data) {
                console.log('filesystem:folder:get', err, data);
                if (!err) {
                    _state.entries = [];
                    for (var i = 0; i < data.files.length; i++) {
                        if (data.files[i].extension === 'note') {
                            _state.entries.push(data.files[i]);
                        }
                    }
                    store.emitChange();
                }
            });
        break;
        case constants.OPEN_NOTE:
            window.socket.emit('filesystem:file:get', '/documents/notes/' + action.name, function (err, data) {
                console.log('filesystem:file:get', err, data);
                if (!err) {
                    try {
                        var o = JSON.parse(data);
                        _state.viewer.title = o.title;
                        _state.viewer.content = o.content;
                        store.emitChange();
                    } catch (err) {
                        console.error('Could\'t parse JSON', data);
                    }
                }
            });
        break;
	}
});

module.exports = store;
