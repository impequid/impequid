// import external

import 'babel-polyfill'; // generator functions
import http from 'http';
import koa from 'koa';
import koaStatic from 'koa-static';
import koaSession from 'koa-generic-session';
import MongooseStore from 'koa-session-mongoose';

// import internal

import config from './config';
import router from './router';

// koa

const app = koa();
const server = http.Server(app.callback());

// cookies and session

app.keys = config.session.keys;

app.use(koaSession({
	store: new MongooseStore({
		collection: 'sessions',
		expires: config.session.duration,
		model: 'session'
	})
}));

// routes

app
	.use(koaStatic('build/client'))
	.use(router.routes())
	.use(router.allowedMethods())
	.use(function * (next) {
		if (this.status !== 404) return;

		this.status = 404;
		switch (this.accepts('html', 'json')) {
			case 'html':
				this.type = 'html';
				this.body = '<h1>Page Not Found</h1> Seems like you broke the internet.';
			break;
			case 'json':
				this.body = {
					message: 'page not found'
				};
			break;
			default:
				this.type = 'text';
				this.body = '404';
		}
	})
;

// start server

server.listen(config.port, config.listenAddress);

server.on('listening', function () {
	console.log(`listening on http://${config.listenAddress}:${config.port}`)
});
