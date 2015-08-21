var wisp = require('socket.io-events');
var io = wisp();
io.on('test', function (sock, args, next) {
	console.log('io test');
	next();
});
io.on('peers.get', function (sock, args, next) {
	args[1]([
		{
			name: 'raspberry-pi',
			ip: '192.168.0.103',
			keys: {
				public: 'BEGIN RSA PUBLIC KEY'
			}
		}, {
			name: 'server',
			ip: '192.168.0.101',
			keys: {
				public: 'BEGIN RSA PUBLIC KEY'
			}
		}
	]);
});
io.on('config.get', function (sock, args, next) {
	args[1]({
		name: 'master-pc',
		ip: '192.168.0.100',
		keys: {
			public: 'BEGIN RSA PUBLIC KEY' // #TODO
		},
		plugins: [{
			name: 'sensor/temperature',
			hardware: [{
				name: 'DHT22',
				type: 'GPIO',
				ports: [1,2,3,4,5,6,7,8]
			}],
			value: 24.12
		}, {
			name: 'sensor/humidity',
			hardware: [{
				name: 'DHT22',
				type: 'GPIO',
				ports: [1,2,3,4,5,6,7,8]
			}],
			value: 52.42
		}]
	});
});

module.exports = {
	io: io
};
