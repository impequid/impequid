import koaRouter from 'koa-router';

// setup main router

const router = koaRouter();

/* /api/external */

import apiExternal from './api/external';
router.use('/api/external', apiExternal.routes(), apiExternal.allowedMethods());

/* /api/fallback */

import apiFallback from './api/fallback';
router.use('/api/fallback', apiFallback.routes(), apiFallback.allowedMethods());

/* /api/main */
import apiMain from './api/main';
router.use('/api/main', apiMain.routes(), apiMain.allowedMethods());

/* /favicon */

router.get('/favicon.ico', function * () {
	this.redirect('https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/12-cube.svg/64px-12-cube.svg.png');
});

/* /authenticate */

import authenticateApp from './apps/authenticate';
router.use('/authenticate', authenticateApp.routes(), authenticateApp.allowedMethods());

/* / */

import mainApp from './apps/main';
router.use('*', mainApp.routes(), mainApp.allowedMethods());

// export

export default router;
