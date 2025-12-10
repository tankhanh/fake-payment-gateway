const Koa = require('koa');
const koaBody = require('koa-body'); // đã có
const KoaStatic = require('koa-static');
const cors = require('@koa/cors');
const router = require('./api');
const { exceptionService } = require('./services');

const app = new Koa();

app
    .use(koaBody({
      json: true,          // QUAN TRỌNG NHẤT – BẬT ĐỌC JSON
      urlencoded: true,    // vẫn hỗ trợ form cũ (nếu cần)
      jsonLimit: '10mb',
      formLimit: '10mb',
    }))
    .use(cors())
    .use(exceptionService.errorHandler) 
    .use(exceptionService.jsonErrorHandler)
    .use(router())
    .use(KoaStatic('public'))
    .listen(process.env.PORT || 5100, () => {
        console.log('server started with port 5100');
        console.log();
        console.log('=======================Payment Gateway Application StartUp===========================');
        console.log('\x1b[33m\x1b[4m%s\x1b[0m', 'http://localhost:5100/api/');
        console.log('=====================================================================');
        console.log();
    });