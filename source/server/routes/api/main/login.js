// import external

import koaRouter from 'koa-router';
import koaBody from 'koa-body';
import reCaptchaValidator from 'recaptcha-validator';
import async from 'async';

// import internal

import userDatabase from '../../../database/users';
import {fakeISPData, applyLogin, getIP} from '../../../utilities';
import config from '../../../config';

// routes

const router = koaRouter();
const body = koaBody();

/**
 * @description verify
 */
router.get('/', function * () {
	if (this.session.name && this.session.email) {
		this.body = {
			name: this.session.name,
			email: this.session.email
		};
	} else {
		this.body = {error: 'not logged in'};
		this.status = 403;
	}
});

/**
 * @description logout
 */
router.delete('/', function * () {
	this.session = null;
	this.body = 'success';
});

/**
 * @description login
 */
router.put('/', body, function * () {

	const {name, password} = this.request.body;

	// attempt login/api

	yield userDatabase.login({
		name,
		password
	}).then(user => {
		let apps = user.apps.map(item => {
			const data = fakeISPData.get(item.name);
			return {
				id: item.name,
				permissions: item.permissions,
				url: data.url,
				author: data.author,
				name: data.name
			};
		});
		this.body = {
			login: {
				name: user.name,
				email: user.email
			},
			apps
		};
		applyLogin(this.session, user);
	}).catch(error => {
		this.body = 'something went wrong';
		this.status = 401;
	});
});

/**
 * @description register
 */
router.post('/', body, function * () {
	const {name, email, password, captcha} = this.request.body;

	const ip = getIP(this);

	try {
		const user = yield new Promise((resolve, reject) => {
			async.series([callback => {
				console.log('verifying captcha');
				// verify captcha
				reCaptchaValidator.promise(config.reCaptcha.secret, captcha, ip).then(() => {
					callback(null, 'valid captcha');
				}).catch(() => {
					callback(['captcha failed', 403]);
				});
			}, callback => {
				console.log('attempting registration');
				// attempt registration
				userDatabase.register({
					name,
					email,
					password
				}).then(data => {
					callback(null, data);
				}).catch(() => {
					callback(['registration failed', 400]);
				});
			}, callback => {
				console.log('attempting login');
				// attempt login
				userDatabase.login({
					name,
					password
				}).then(user => {
					callback(null, user);
				}).catch(() => {
					callback(['login failed', 404]);
				});
			}], (error, results) => {
				console.log('finshed');
				// resolve promise
				if (!error) {
					resolve(results[2]);
				} else {
					reject(error);
				}
			});
		});
		this.body = 'success';
		applyLogin(this.session, user);
	} catch (error) {
		console.error(error);
		this.body = 'something went wrong';
		this.status = 500;
	}
});

export default router;
