const router = require('koa-router')();
const serve = require('koa-static')('build/client');

export {
	router,
	serve
};