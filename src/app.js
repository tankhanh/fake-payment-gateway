const Koa = require('koa');
const koaBody = require('koa-body');
const KoaStatic = require('koa-static');
const cors = require('@koa/cors');
const apiRouter = require('./api'); // ← Đổi tên để rõ ràng
const { exceptionService } = require('./services');

const app = new Koa();

// Middleware cơ bản
app.use(koaBody());
app.use(cors());
app.use(exceptionService.errorHandler());
app.use(exceptionService.jsonErrorHandler());

// Static files (nếu có)
app.use(KoaStatic('public'));

// Root welcome route
app.use(async (ctx, next) => {
  if (ctx.path === '/' || ctx.path === '') {
    ctx.body = {
      message: 'Fake Payment Gateway API - Deployed on Vercel',
      status: 'OK',
      docs: '/api',
      endpoints: {
        card_payment: 'POST /api/v1/payment/card',
        phone_payment: 'POST /api/v1/payment/phone',
      },
      tip: 'Use this with APPost Fake Payment (test)',
      url_for_appost: 'https://fake-payment-gateway.vercel.app/api/v1/payment/card'
    };
    ctx.status = 200;
    return;
  }
  await next();
});

// Mount API router đúng cách
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

// XUẤT CHO VERCEL – DÒNG QUAN TRỌNG NHẤT
module.exports = app.callback();
