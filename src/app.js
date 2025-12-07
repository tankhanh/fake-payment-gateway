const Koa = require('koa');
const koaBody = require('koa-body');
const KoaStatic = require('koa-static');
const cors = require('@koa/cors');
const apiRouter = require('./api');

const app = new Koa();

// Middleware cơ bản
app.use(koaBody());
app.use(cors());
app.use(KoaStatic('public'));

// Welcome route cho root
app.use(async (ctx, next) => {
  if (ctx.path === '/' || ctx.path === '') {
    ctx.status = 200;
    ctx.body = {
      message: 'Fake Payment Gateway - Vercel Online',
      status: 'OK',
      tip: 'Use POST /api/v1/payment/card for APPost',
      endpoints: {
        api_docs: 'GET /api',
        create_card: 'POST /api/v1/payment/card',
        get_card: 'GET /api/v1/payment/card',
      },
    };
    return;
  }
  await next();
});

// Mount API router đúng cách
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

// Export cho Vercel
module.exports = app.callback();
