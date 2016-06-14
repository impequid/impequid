const io = require('socket.io')();

export default io;

export function init (server) {
	io.attach(server);
}

io.on('connection', (socket) => {
	console.info(`${socket.id} connected`);
	
	socket.on('disconnect', () => {
		console.info(`${socket.id} disconnected`)
	});
});