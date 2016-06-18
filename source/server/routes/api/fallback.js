// import external

import koaRouter from 'koa-router';
import koaBody from 'koa-body';

// import internal

import userDatabase from '../../database/users';
import {applyLogin} from '../../utilities';

// add routes

const router = koaRouter();
const body = koaBody();

/**
 * @description logout
 */
router.get('/login', function * (next) {
	this.session = null;
	this.redirect(this.headers.referer);
});

/**
 * @description login
 */
router.post('/login', body, function * () {
	const {name, password} = this.request.body;

	// attempt login

	yield userDatabase.login({
		name,
		password
	}).then(user => {
		applyLogin(this.session, user);
		this.redirect(this.headers.referer);
	}).catch(error => {
		console.error(error);
		this.body = 'something went wrong';
		this.status = 401;
	});
});


export default router;
