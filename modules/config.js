var multiconfig = require('multiconfig');
var path = require('path');

module.exports = multiconfig.load();
module.exports.root = path.resolve(__dirname + '../..');
