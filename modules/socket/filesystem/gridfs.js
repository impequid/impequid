var db = require('../database');
var log = require('../log').createNamespace({
    name: 'socket-filesystem'
});

function getFolder (socket, path, callback) {
    db.models.Folder.findOne({
        path: path,
        user: socket.handshake.session.user.id
    }, function (err, folder) {
        if (!err && folder) {
            callback(null, folder);
        } else {
            callback('folder not found');
        }
    });
}

function createFolder (socket, path, callback) {
    db.models.Folder.create({
        path: path,
        user: socket.handshake.session.user.id,
        files: [],
        folders: []
    }, function (err, data) {
        if (!err) {
            callback(null, data);
        } else {
            callback(err);
        }
    });
}

function renameFolder (socket, path, newName, callback) {
    db.models.Folder.findOne({
        path: path
    }, function (err, doc) {
        if (err) return callback('no such folder');
        doc.name = newName;
        doc.save(function (err, data) {
            if (!err) {
                return callback(null, data);
            } else {
                log.error(err);
                return callback('something went wrong');
            }
        });
    });
}

module.exports = {
    getFolder: getFolder,
    createFolder: createFolder,
    renameFolder: renameFolder
};