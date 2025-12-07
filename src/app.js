const Koa = require('koa');
const koaBody = require('koa-body');
const KoaStatic = require('koa-static');
const cors = require('@koa/cors');
const apiRouter = require('./api');

const app = new Koa();

app.use(koaBody());
app.use(cors());
app.use(KoaStatic('public'));

// Welcome route for root to prevent 404
app.use(async (ctx, next) => {
  if (ctx.path === '/' || ctx.path === '') {
    ctx.body = 'Fake Payment Gateway is online! Use /api/v1/payment/card for APPost tests.';
    return;
  }
  await next();
});

// Mount API router correctly
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

// Export for Vercel Serverless
module.exports = app.callback();
