// import external

import koaRouter from 'koa-router';
import ReactDOM from 'react-dom/server';
import React from 'react';

// import internal

import userDatabase from '../../database/users';
import config from '../../config';
import {fakeISPData} from '../../utilities';

// components

import MainComponent from '../../apps/main';

// routes

const router = koaRouter();

router.get('/', render);
router.get('/dashboard', render);
router.get('/login', render);
router.get('/register', render);

function * render () {
	const path = this.url;

	// whitelist paths
	const matched = ['/', '/login', '/register'].indexOf(path) !== -1;

	if (!this.session.name && !matched) { // not logged in
		this.redirect('/login');
	} else if (!!this.session.name && matched) { // logged in
		this.redirect('/dashboard');
	} else {
		try {
			// apps apps apps
			let apps = yield userDatabase.getUser({
				name: this.session.name
			});

			apps = apps ? apps.apps : [];

			apps = apps.map(item => {
				const data = fakeISPData.get(item.name);
				return {
					id: item.name,
					permissions: item.permissions,
					url: data.url,
					author: data.author,
					name: data.name
				};
			});

			this.body = ReactDOM.renderToStaticMarkup(
				<MainComponent path={path} initialState={{
					login: {
						reCaptchaKey: config.reCaptcha.public,
						name: this.session.name,
						email: this.session.email,
						valid: !!this.session.name
					},
					apps
				}}/>
			);
		} catch (error) {
			throw(error);
			this.body = 'something went wrong';
			this.status = 500;
		}
	}
}

export default router;
