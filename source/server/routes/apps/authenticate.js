// import external

import koaRouter from 'koa-router';
import ReactDOM from 'react-dom/server';
import React from 'react';
import crypto from 'crypto';

// import internal

import config from '../../config';
import {acceptTokenStore, fakeISPData} from '../utilities';

// components

import AuthenticateComponent from '../../apps/authenticate';

// routes

const router = koaRouter();

/**
 * @description authenticate app
 */
router.get('/:app/:permissions', function * () {
	// prevent embedding for security reasons
	this.set('X-Frame-Options', 'deny');

	const {app} = this.params;
	const permissions = this.params.permissions.split(',');

	const data = fakeISPData.get(app);

	// create authenticate token
	const token = crypto.randomBytes(16).toString('hex');
	acceptTokenStore.add(token, {
		app,
		permissions
	});

	this.body = ReactDOM.renderToStaticMarkup(
		<AuthenticateComponent initialState={{
			app: {
				token: token,
				returnUrl: data.returnUrl.replace(':server', config.serverName),
				author: data.author,
				name: data.name,
				permissions,
				url: data.url
			},
			login: {
				name: this.session.name,
				email: this.session.email,
				valid: !!this.session.name
			}
		}}/>
	);
});

export default router;
