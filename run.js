var requireOne = require('require-one');
var fs = require('fs');
var experience = require(__dirname + '/../experience/');

var project = experience.create({
    debug: true,
    compress: true,
    sessions: {
        secret: 'keyboard cat'
    },
    mongoose: {
        sessions: 'mongodb://server/experience_sessions'
    },
    mongo: false,
    ssl: {
        key: fs.readFileSync('./ssl/private.key'),
        cert: fs.readFileSync('./ssl/certificate.crt')
    }
});

var app = new experience.Application(__dirname);

project.add('/home/network/test/', app);

project.listen(8080);
