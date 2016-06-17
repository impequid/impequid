// import external

import koaRouter from 'koa-router';

// routes

const router = koaRouter();

/* /login */

import loginRouter from './login';
router.use('/login', loginRouter.routes(), loginRouter.allowedMethods());

/* /token */
import tokenRouter from './token';
router.use('/token', tokenRouter.routes(), tokenRouter.allowedMethods());

/* /authenticate */
import authenticateRouter from './authenticate';
router.use('/authenticate', authenticateRouter.routes(), authenticateRouter.allowedMethods());

/* /permission */
import permissionRouter from './permission';
router.use('/permission', permissionRouter.routes(), permissionRouter.allowedMethods());

export default router;
