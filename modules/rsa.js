// node
var fs = require('fs');
var net = require('net');
var path = require('path');
var child = require('child_process');

// npm
// var gpio = require('gpio'); #TODO
var moment = require('moment');
var secure = require('secure-peer');
var validator = require('validator');

// load all plugins
var plugins = require('./utils').loadPlugins();

// setup safe chars
var safeChars = '\\w _:.,;!?%\\"\\\'';

// grab the hosts
var hosts = JSON.parse(fs.readFileSync(path.join(__dirname, '/hosts.json')))

var peer = secure(hosts.local);

var connected = false;

function connect () {
	var socket = net.connect({
		port: hosts.server.port,
		host: hosts.server.host
	});

	connected = true;

	var sendStream;

	var encryptedStream = peer(function (decryptedStream) {
		function send (object) {
			decryptedStream.write(JSON.stringify(object));
		}

		// pingback log 'connected'
		send({
			type: 'echo',
			message: 'connected',
			options: {
				type: 'say'
			}
		});

		// implement stuff to handle
		decryptedStream.on('data', function (raw) {
			try {
				var data = JSON.parse(raw);
				log.debug(data);
				switch (data.type) {
					case 'log':
						log.notice(data.message);
					break;
					case 'error':
						log.error('server encountered an error: ' + JSON.stringify(data));
					break;
					case 'echo':
						send({type: data.options.type, message: data.message})
					break;
					case 'device':
						switch (data.name) {
							case 'fan':
								child.exec('../raspberry-remote/send 01101 1 ' + (data.power=='on'?1:0));
							break;
							default:
								log.error('Unknown data.name ' + data.name);
								send({
									type: 'error',
									message: 'unknown data.name',
									data: data
								});
						}
					break;
					case 'sendInfo':
						switch (data.name) {
							case 'humidity':
								send({
									type: 'forward',
									to: data.to,
									message: {
										type: 'say',
										message: 'Current humidity: ' + humidity + '%.'
									}
								});
							break;
							case 'temperature':
								send({
									type: 'forward',
									to: data.to,
									message: {
										type: 'say',
										message: 'Current temperature: ' + temperature + ' degrees Celsius.'
									}
								});
							break;
							case 'dht22':
								send({
									type: 'forward',
									to: data.to,
									message: {
										type: 'say',
										message: 'Current humidity: ' + humidity + '%. Current Temperature: ' + temperature + ' degrees Celsius.'
									}
								});
							break;
							default: log.error('Unknown data.name \'' + data.name + '\'');
						}
					break;
					case 'say':
						child.exec('espeak "' + validator.whitelist(data.message, safeChars) + '"', function (error, stdout, stderr) {
							if (error) log.error(error);
						});
					break;
					default: log.error('Unknown data.type \'' + data.type + '\'');
				}
			} catch (err) {
				log.error('Could not parse JSON.');
			}
		});
	});

	// create encrypted duplex stream
	socket.pipe(encryptedStream).pipe(socket);

	// verify identity
	encryptedStream.on('identify', function (id) {
		if (id.key.public == hosts.server.public) {
			id.accept();
			log.info('Connected to server ' + hosts.server.host + ':' + hosts.server.port);
		} else {
			log.error('[CRITICAL] Server responded with wrong public key.'); // #TODO log ip, port, name, whatever
			id.reject();
		}
	});

	socket.on('end', function (data) {
		log.info('ended with ' + data);
		connected = false;
		setTimeout(reconnect, 5000);
	});

	socket.on('error', function (err) {
		log.info('ignoring error: ' + err);
		setTimeout(reconnect, 5000);
	});
}

function reconnect () {
	log.warning('reconnecting');
	if (!connected) connect();
	if (!connected) setTimeout(reconnect, 5000);
}

// connect();
