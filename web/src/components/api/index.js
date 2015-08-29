var log = function log () {
    console.log(JSON.stringify(arguments));
};

module.exports = {
    getConfig: function getConfig (callback) {
    	if (!callback) callback = log;
    	window.socket.emit('config.get', callback);
    },
    getPeers: function getPeers (callback) {
    	if (!callback) callback = log;
    	window.socket.emit('peers.get', callback);
    }
};
