var db = require('../db');

function getFolder (socket, path, callback) {
    db.models.Folder.findOne({
        path: path,
        user: socket.handshake.session.user.id
    }, function (err, folder) {
        if (!err) {
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
        files: ['hello.world'],
        folders: []
    }, function (err) {
        console.error(err);
    });
}

module.exports = {
    getFolder: getFolder,
    createFolder: createFolder
};
