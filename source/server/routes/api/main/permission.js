// import external

import koaRouter from 'koa-router';

// import internal

import permissionDatabase from '../../../database/permissions';
import {loginify} from '../../../utilities';

// routes

const router = koaRouter();

/**
 * @description return a list of all permissions
 */
router.get('/', function * () {
	const k = this;
	yield loginify(this, async function (user) {
		try {
			const data = await permissionDatabase.getAll(user);
			k.body = data;
		} catch (error){
			console.error(error);
			k.body = {
				error: 'could not get permissions'
			};
			k.status = 500;
		}
	});
});

/**
 * @description delete a token
 */
router.delete('/:app', function * () {
	const {app} = this.params;

	const k = this;
	yield loginify(this, async function (user) {
		try {
			permissionDatabase.remove({app, user});
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
