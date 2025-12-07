const Koa = require('koa');
const koaBody = require('koa-body');
const KoaStatic = require('koa-static');
const cors = require('@koa/cors');
const router = require('./api');
const { exceptionService } = require('./services');

const app = new Koa();

app
  .use(koaBody())
  .use(cors())
  .use(exceptionService.errorHandler())     // register generic error handler middleware
  .use(exceptionService.jsonErrorHandler()) // register json error handler middleware
  .use(router.routes())                      // ← SỬA: router.routes() thay vì router()
  .use(router.allowedMethods())
  .use(KoaStatic('public'));                 // serve static files

// THÊM ROUTE ROOT Ở ĐÂY (trước khi export)
app.use(async (ctx, next) => {
  if (ctx.path === '/' || ctx.path === '') {
    ctx.body = {
      message: 'Welcome to Fake Payment Gateway API!',
      docs: '/api',
      payment_card: '/api/v1/payment/card',
      payment_phone: '/api/v1/payment/phone',
      tip: 'Use POST /api/v1/payment/card from APPost'
    };
    ctx.status = 200;
    return;
  }
  await next();
});

// PHẢI ĐỂ DÒNG NÀY CUỐI CÙNG FILE
module.exports = app.callback();
