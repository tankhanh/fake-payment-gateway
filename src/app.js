const Koa = require('koa');
const koaBody = require('koa-body');
const KoaStatic = require('koa-static');
const cors = require('@koa/cors');
const apiRouter = require('./api'); // ← Đây là router instance

const app = new Koa();

// === CÁC MIDDLEWARE CƠ BẢN ===
app.use(koaBody());
app.use(cors());
app.use(KoaStatic('public'));

// === WELCOME ROUTE CHO ROOT ===
app.use(async (ctx, next) => {
  if (ctx.path === '/' || ctx.path === '') {
    ctx.status = 200;
    ctx.body = {
      message: 'Fake Payment Gateway - Deployed on Vercel',
      status: 'ONLINE',
      tip: 'Use POST /api/v1/payment/card from APPost',
      endpoints: {
        create_payment: 'POST /api/v1/payment/card',
        get_payments: 'GET /api/v1/payment/card',
        api_docs: 'GET /api'
      },
      url_for_appost: 'https://fake-payment-gateway.vercel.app/api/v1/payment/card'
    };
    return;
  }
  await next();
});

// === MOUNT API ROUTER ===
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

// === XÓA HẾT exceptionService vì không tồn tại ===
// (Đây chính là nguyên nhân crash!)

// === XUẤT CHO VERCEL – DÒNG QUAN TRỌNG NHẤT ===
module.exports = app.callback();
