// src/api/index.js
const Router = require('koa-router');
const StatusCodes = require('http-status-codes');
const { Response } = require('../../types');

// SỬA TỪ ĐÂY
const router = new Router();        // ← XÓA object config
router.prefix('/api');              // ← Dùng .prefix() thay vì truyền vào constructor
// ĐẾN ĐÂY

// Phần còn lại giữ nguyên 100%
router.get('/', async (ctx, next) => {
  const response = new Response();
  ctx.response.status = StatusCodes.OK;
  response.success = true;
  response.message = "Application Invoked !";
  // ... giữ nguyên
  ctx.body = response;
  await next();
});

module.exports = router; // ← Export instance router
