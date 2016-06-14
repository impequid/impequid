const app = require('koa')();
const http = require('./http');
const server = require('http').Server(app.callback());
const socket = require('./socket').init(server);

app
	.use(http.serve)
	.use(http.router.routes())
	.use(http.router.allowedMethods())
;

const port = 44400;

server.listen(port, () => {
	console.log(`listening on http://127.0.0.1:${port}`);
});