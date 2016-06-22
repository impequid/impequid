// import external

import koaRouter from 'koa-router';

// import internal

import tokenDatabase from '../../database/tokens';
import backgroundTokenDatabase from '../../database/background-tokens';

import {user, permission, permissions} from '../../utilities';

// routes

const router = koaRouter();

router.use(function * (next) {
	console.log(this.path);
	yield next;
});

/**
 * @description retrieve a background access token
 */
router.get('/background', token, permissions, permission.background, function * () {
	try {
		const response = yield backgroundTokenDatabase.getByApp({app: this.token.app, user: this.token.user});
		this.body = {
			token: `b${response.id}`
		};
	} catch (error) {
		this.body = {
			error: 'could not get background token'
		};
		this.status = 500;
	}
});

/**
 * @description get user data
 */
router.get('/user', token, permissions, permission.user.name, permission.user.id, user, function * () {
	this.body = {
		name: this.user.name,
		id: this.user.id
	};
});

// token checking

/**
 * @description verify token validity
 */
router.get('/verify', function * () {
	try {
		const token = this.headers.token || '';
		const type = token.charAt(0);
		const id = token.substring(1);
		switch (type) {
			case 'n':
				yield tokenDatabase.get({id});
				this.body = true;
			break;
			case 'b':
				yield backgroundTokenDatabase.get({id});
				this.body = true;
			break;
			default:
				this.body = false;
		}
	} catch (error) {
		this.body = false;
		this.status = 403;
	}
});

export function * token (next) {
	const {token} = this.headers;

	try {
		const type = token.charAt(0);
		const id = token.substring(1);

		switch (type) {
			case 'n':
				this.token = yield tokenDatabase.get({id});
				yield next;
			break;
			case 'b':
				this.token = yield backgroundTokenDatabase.get({id});
				yield next;
			break;
			default:
				this.body = {
					error: 'malformed token'
				};
				this.status = 400;
		}
	} catch (error) {
		console.error(error);
		this.body = {
			error: 'invalid token'
		};
		this.status = 403;
	}

}

// catch all invalid calls

router.get('*', function * () {
	this.body = {
		error: 'unknown API'
	};
	this.status = 404;
});

// export

export default router;
