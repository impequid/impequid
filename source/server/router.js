// import external

import koaBody from 'koa-body';
import koaRouter from 'koa-router';
import reCaptchaValidator from 'recaptcha-validator';
import async from 'async';
import ShortTermMemory from 'short-term-memory';
import crypto from 'crypto';
import React from 'react';
import ReactDOM from 'react-dom/server';

// import internal

import config from './config';
import database from './database';
import AuthenticateComponent from '../client/apps/authenticate/';

// setup routes

const router = koaRouter();
const body = koaBody();

/**
 * @description verify
 */
router.get('/api/login', function * (next) {
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
router.delete('/api/login', function * (next) {
	this.session = null;
	this.body = 'success';
});

/**
 * @description login
 */
router.put('/api/login', body, function * () {

	const {name, password} = this.request.body;

	// attempt login

	yield database.login({
		name,
		password
	}).then(user => {
		this.body = {
			name: user.name,
			email: user.email
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
router.post('/api/login', body, function * () {
	const {name, email, password, captcha} = this.request.body;

	const ip = getIP(this);

	try {
		const user = yield new Promise((resolve, reject) => {
			async.series([callback => {
				// verify captcha
				reCaptchaValidator.promise(config.reCaptcha.secret, captcha, ip).then(() => {
					callback(null, 'valid captcha');
				}).catch(() => {
					callback(['captcha failed', 403]);
				});
			}, callback => {
				// attempt registration
				database.register({
					name,
					email,
					password
				}).then(data => {
					callback(null, data);
				}).catch(() => {
					callback(['registration failed', 400]);
				});
			}, callback => {
				// attempt login
				database.login({
					name,
					password
				}).then(user => {
					callback(null, user);
				}).catch(() => {
					callback(['login failed', 404]);
				});
			}], (error, results) => {
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
		this.body = error[0];
		this.status = error[1];
	}
});

// create authenticate accept token list
const authenticateTokens = new ShortTermMemory({
	duration: 120000
});

const fakeISPData = new Map();
fakeISPData.set('dns.smartfl.at', {
	url: 'https://dns.smartfl.at',
	returnUrl: 'https://dns.smartfl.at/authenticate/:token@:server',
	name: 'Smartflat DynDNS',
	author: {
		name: 'dodekeract',
		url: 'https://github.com/dodekeract'
	},
	permissions: ['name', 'notify']
});

/**
 * @description authenticate
 */
router.get('/authenticate/:app', function * () {
	// prevent embedding for security reasons
	this.set('X-Frame-Options', 'deny');

	const appName = this.params.app;
	const data = fakeISPData.get(appName);

	// create authenticate token
	const token = crypto.randomBytes(16).toString('hex');
	authenticateTokens.add(token, {
		app: appName,
		permissions: data.permissions
	});

	this.body = ReactDOM.renderToString(
		<AuthenticateComponent state={{
			serverName: config.serverName,
			token: token,
			returnUrl: data.returnUrl,
			author: data.author,
			name: data.name,
			user: {
				name: this.session.name,
				email: this.session.email
			},
			permissions: data.permissions,
			url: data.url
		}}/>
	);
});

router.get('/authenticate/accept/:token', function * () {
	// prevent embedding for security reasons
	this.set('X-Frame-Options', 'deny');

	const {token} = this.params;
	const data = authenticateTokens.get(token);

	const newToken = crypto.randomBytes(16).toString('hex');

	if (data !== false) {
		this.redirect(fakeISPData.get(data.app).returnUrl.replace(':token', newToken).replace(':server', config.serverName));
	} else {
		this.body = {
			error: 'invalid token'
		};
		this.status = 403;
	}
});

/**
 * @description add user data to session
 */
function applyLogin (session, user) {
	session.name = user.name;
	session.email = user.email;
}

/**
 * @description support nginx proxy and direct access
 */
function getIP (context) {
	return context.headers['x-real-ip'] || context.ip;
}

export default router;
