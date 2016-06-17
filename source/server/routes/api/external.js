import koaRouter from 'koa-router';

const router = koaRouter();

router.get('/verify', function * () {
	console.log(this.headers);
});

export default router;
