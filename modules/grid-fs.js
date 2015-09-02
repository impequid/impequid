// external
var Grid = require('gridfs-stream');
var fs = require('fs');

// internal
var db = require('./db');
var log = require('./log').createNamespace({
    name: 'GRID',
    colors: ['bgYellowBright', 'black']
});

// global variables

// setup gridfs-stream
Grid.mongo = db.mongoose.mongo;

module.exports.init = function init (connection, mongo) {
    var gfs = new Grid(connection.db, mongo);

    log.info('initialized');

    // JUST DO IT
    // var writeStream = gfs.createWriteStream({
    //     filename: 'app.js'
    // });
    // var readStream = fs.createReadStream('./web/dist/app.js');
    // readStream.pipe(writeStream);
    // readStream.on('data', function (data) {
    //     log.debug(data);
    // });
    // writeStream.on('close', function (file) {
    //     log.info(file.filename + 'Written To DB');
    // });
}
