// import external

import koaRouter from 'koa-router';
import ReactDOM from 'react-dom/server';
import React from 'react';
import crypto from 'crypto';
import _ from 'lodash';

// import internal

import config from '../../config';
import {getUser, deserializePermissionTree, acceptTokenStore, fakeISPData} from '../../utilities';
import permissionDatabase from '../../database/permissions';

// components

import AuthenticateComponent from '../../apps/authenticate';

// routes

const router = koaRouter();

/**
 * @description authenticate app
 */
router.get('/:app/:serializedTree', function * () {
	// prevent embedding for security reasons
	this.set('X-Frame-Options', 'deny');

	const {app, serializedTree} = this.params;

	const permissions = deserializePermissionTree(serializedTree);

	const data = fakeISPData.get(app);

	const user = getUser(this);

	// create authenticate token

	const token = crypto.randomBytes(16).toString('hex');
	acceptTokenStore.add(token, {
		app,
		permissions
	});

	// redirect if permissions are already granted

	if (user.valid) {
		const currentPermissions = yield permissionDatabase.get({user: user.id, app});
		if (_.isEqual(currentPermissions, permissions)) {
			return this.redirect(`/api/main/authenticate/accept/${token}`);
		}
	}

	// render app

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
