var fs = require('fs');
var path = require('path');
var async = require('async');
var config = require('../../config');
var log = require('../../log').createNamespace({
    name: 'socket-filesystem'
});

var root = path.join(config.root, config.filesystem.path);

function cleanPath (folder) {
    return path.join('/', folder);
}

function getUser (socket) {
    return socket.handshake.session.user.id.toString();
}

// socket.handshake.session.user.id
function getFolder (socket, folder, callback) {
    var user = getUser(socket);
    fs.readdir(path.join(root, user, cleanPath(folder)), function (err, results) {
        if (!err) {
            var files = [], folders = [];
            async.each(results, function (file, callback) {
                var p = path.join(root, user, cleanPath(folder), file);
                fs.stat(p, function (err, stats) {
                    if (stats.isDirectory()) {
                        folders.push(file);
                        callback();
                    } else if (stats.isFile()){
                        files.push({
                            name: file,
                            size: stats.size,
                            modified: stats.mtime,
                            created: stats.ctime,
                            extension: path.extname(file).replace('.',''),
                            base: file.substring(0, file.length - path.extname(file).length)
                        });
                        callback();
                    } else {
                        callback(true);
                    }
                });
            }, function (err) {
                if (!err) {
                    callback(null, {files: files, folders: folders});
                } else {
                    log.error(err);
                    callback(true);
                }
            });
        } else {
            return callback(true);
        }
    });
}

function createFolder (socket, folder, callback) {
    var user = getUser(socket);
    fs.mkdir(path.join(root, user, cleanPath(folder)), function (err, data) {
        log.debug('createFolder', err, data);
        if (!err) {
            callback(null, true);
        } else {
            callback(true);
        }
    });
}

function renameFolder (socket, folder, newName, callback) {
    var user = getUser(socket);
    fs.rename(path.join(root, user, cleanPath(folder)), path.join(root, user, newName), function (err, data) {
        log.debug('renameFolder', err, data);
        if (!err) {
            callback(null, true);
        } else {
            callback(true);
        }
    });
}

function deleteFolder (socket, folder, callback) {
    var user = getUser(socket);
    fs.rmdir(path.join(root, user, cleanPath(folder)), function (err, data) {
        if (!err) {
            callback(null, true);
        } else {
            log.error(err);
            callback(true);
        }
    });
}

function init (id, callback) {
    log.debug('initializing', id);
    fs.mkdir(path.join(root, id), callback);
}

function getFile (socket, filePath, callback) {
    var user = getUser(socket);
    fs.readFile(path.join(root, user, cleanPath(filePath)), function (err, data) {
        if (!err) {
            callback(null, data.toString('utf-8'));
        } else {
            log.error(err);
            callback(true);
        }
    });
}

function createFile (socket, readStream, meta) {
    var user = getUser(socket);
    var filename = path.basename(meta.name);

    log.debug('creating file', user, filename);

    // write
    var writeStream = fs.createWriteStream(path.join(root, user, cleanPath(path.join(meta.path, filename))));
    readStream.pipe(writeStream);

    // finished
    writeStream.on('close', function (file) {
        log.info(filename + ' written');
    });
}

function renameFile (socket, filePath, newFilePath, callback) {
    var user = getUser(socket);
    fs.rename(path.join(root, user, cleanPath(filePath)), path.join(root, user, cleanPath(newFilePath)), function (err) {
        if (!err) {
            callback(null, true);
        } else {
            callback(true);
        }
    });
}

function deleteFile (socket, filePath, callback) {
    var user = getUser(socket);
    fs.unlink(path.join(root, user, cleanPath(filePath)), function (err) {
        if (!err) {
            callback(null, true);
        } else {
            callback(true);
        }
    });
}

module.exports = {
    getFolder: getFolder,
    createFolder: createFolder,
    renameFolder: renameFolder,
    deleteFolder: deleteFolder,

    getFile: getFile,
    createFile: createFile,
    renameFile: renameFile,
    deleteFile: deleteFile,
    init: init
};
