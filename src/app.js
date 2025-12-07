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
    .use(exceptionService.errorHandler) // register generic error handler middleware
    .use(exceptionService.jsonErrorHandler) // register json error handler middleware
    .use(router()) // Use the Router on the sub routes
    .use(KoaStatic('public')); // server statics
    // Bootstrap the server
    module.exports = app.callback();
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Fake Payment Gateway API! Use /api/v1/payment/card for payments.' });
});
