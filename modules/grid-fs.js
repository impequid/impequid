// external
var Grid = require('gridfs-stream');
var fs = require('fs');

// internal
var db = require('./database');
var log = require('./log').createNamespace({
    name: 'GRID',
    colors: ['bgYellowBright', 'black']
});

// global variables

// setup gridfs-stream
Grid.mongo = db.mongoose.mongo;

var gfs;

function init (connection, mongo) {
    gfs = new Grid(connection.db, mongo);
    module.exports.gridFS = gfs;
    log.info('initialized');
}

module.exports = {
    gridFS: gfs,
    init: init
};
