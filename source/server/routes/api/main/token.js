// import external

import koaRouter from 'koa-router';
import koaBody from 'koa-body';

// import internal

import tokenDatabase from '../../../database/tokens';
import {loginify} from '../../../utilities';

// routes

const router = koaRouter();

/**
 * @description return a list of all valid tokens
 */
router.get('/', function * () {
	const k = this;
	yield loginify(this, async function (user) {
		try {
			const data = await tokenDatabase.getAll(user);
			k.body = data;
		} catch (error){
			console.error(error);
			k.body = {
				error: 'could not get tokens'
			};
			k.status = 500;
		}
	});
});

/**
 * @description create or update the token for an app
 */
router.get('/:app', function * () {
	const {app} = this.params;

	const k = this;
	yield loginify(this, async function (user) {
		try {
			const token = await tokenDatabase.add({
				user,
				app
			});
			k.body = {token};
		} catch (error) {
			console.error(error);
			k.body = {
				error: 'could not create token'
			};
			k.status = 409;
		}
	});
});

/**
 * @description delete a token
 */
router.delete('/:token', function * () {
	const {token} = this.params;

	const k = this;
	yield loginify(this, async function (user) {
		try {
			tokenDatabase.remove({token, user});
		} catch (error) {
			console.error(error);
			k.body = {
				error: 'not found'
			};
			k.status = 404;
		}
	});
});

export default router;
