var sios = require('socket.io-stream');

function uploadFile (options) {
    var stream = sios.createStream({
        highWaterMark: 1024*256
    });
    sios(window.socket).emit('file', stream, {
        size: options.file.size,
        name: options.name,
        path: options.path
    });
    var blobStream = sios.createBlobReadStream(options.file, {
        highWaterMark: 256*1024
    });
    blobStream.pipe(stream);
    return blobStream;
}

module.exports = {
    uploadFile: uploadFile
};
