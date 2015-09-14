var expect = require('expect.js');
var SimpleChild = require('simple-child');
var sioc = require('socket.io-client');
var Log = require('compact-log');
var log = new Log({
    levelMode: 'smartNoBrackets',
    clear: true
});

var config = require('../modules/config');

describe('login', function () {
	// via http://stackoverflow.com/a/15553045/2857873
	var socket, child;

	before(function (done) {
        this.timeout(4000);
		child = new SimpleChild('node ' + __dirname + '/../index.js');
		child.start();
        setTimeout(done, 2500);
	});

	beforeEach(function (done) {
        this.timeout(4000);
		// Setup
		socket = sioc.connect(config.host.name, {
			'reconnection delay': 0,
			'reopen delay': 0,
			'force new connection': true
		});
		socket.on('connect', function () {
			log.debug('connected');
            socket.emit('session:login', {email: 'test@te.st', password: 'testtest'}, function (error, data) {
    			log.debug('session:login', error, data);
                socket.emit('token:create', config.host.name, function (error, token) {
                    log.debug('created token', token);
                    socket.emit('token:digest', token, function (error, data) {
                        log.debug('token:digest', error, data);
            			expect(error).to.not.be.ok();
            			expect(data).to.be.ok();
            			done();
            		});
        		});
    		});
		});
		socket.on('disconnect', function () {
			log.debug('disconnected');
		})
	});

	afterEach(function(done) {
		// Cleanup
		if(socket.connected) {
			log.debug('disconnecting');
			socket.disconnect();
		} else {
			log.error('no connection to break');
		}
		done();
	});

    it('filesystem:folder:create', function (done) {
		socket.emit('filesystem:folder:create', '/', function (error, data) {
            log.debug('filesystem:folder:create', error, data);
			expect(error).to.not.be.ok();
			expect(data).to.be.ok();

            expect(data.folders).to.be.an('array');
            expect(data.files).to.be.an('array');
			done();
		});
	});


	it('filesystem:folder:get', function (done) {
		socket.emit('filesystem:folder:get', '/', function (error, data) {
            log.debug('filesystem:folder:get', error, data);
			expect(error).to.not.be.ok();
			expect(data).to.be.ok();

            expect(data.folders).to.be.an('array');
            expect(data.files).to.be.an('array');
			done();
		});
	});

	after(function (done) {
        log.info('after');
		child.stop(function (err, data) {
            done();
        });
	});
});
