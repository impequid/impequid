// import external

import crypto from 'crypto';
import koaRouter from 'koa-router';

// import internal

import {acceptTokenStore, fakeISPData, loginify} from '../../../utilities';
import config from '../../../config';
import tokenDatabase from '../../../database/tokens';
import permissionDatabase from '../../../database/permissions';

// routes

const router = koaRouter();

router.get('/accept/:token', function * () {
	// prevent embedding for security reasons
	this.set('X-Frame-Options', 'deny');

	const {token} = this.params;
	const {app, permissions} = acceptTokenStore.get(token);

	const k = this;
	yield loginify (this, async function (user) {
		if (app) {
			const {returnUrl} = fakeISPData.get(app);

			const token = await tokenDatabase.add({
				user,
				app
			});

			await permissionDatabase.add({
				user,
				app,
				permissions
			});

			k.redirect(returnUrl.replace(':token', token).replace(':server', config.serverName));
		} else {
			k.body = {
				error: 'token expired, please try again'
			};
			k.status = 403;
		}
	});
});

export default router;
