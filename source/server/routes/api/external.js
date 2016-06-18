// import external
import koaRouter from 'koa-router';

// import internal
import tokenDatabase from '../../database/tokens';
import backgroundTokenDatabase from '../../database/background-tokens';

// routes
const router = koaRouter();

router.get('/verify', function * () {
	try {
		const token = yield tokenDatabase.get(this.headers.token);
		this.body = token;
	} catch (error) {
		this.body = {
			error: 'not found'
		};
		this.status = 403;
	}
});

router.get('/backgroundToken', function * () {
	try {
		const token = yield tokenDatabase.get(this.headers.token);
		if (token.permissions.indexOf('background') !== -1) {
			console.log('background-access is allowed');
			this.body = 'success';
		} else {
			this.body = {
				error: 'insufficient permissions'
			};
			this.status = 403;
		}
	} catch (error) {
		this.body = {
			error: 'invalid token'
		};
		this.status = 403;
	}
});

export default router;
