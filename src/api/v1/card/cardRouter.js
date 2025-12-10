const Router = require('koa-router');
const StatusCodes = require('http-status-codes');
const { CardPayment } = require('../../../services');
const { Response } = require('../../../types');

const router = new Router({
    prefix: '/api/v1/payment/card',
});

// Lịch sử giao dịch (giữ nguyên)
router.get('/', async (ctx, next) => {
    const query = ctx.request.query; // ← ĐỌC TỪ QUERY STRING

    const amount = query.amount ? parseFloat(query.amount) : 0;

    if (!amount || amount <= 0) {
        ctx.response.status = StatusCodes.BAD_REQUEST;
        ctx.body = { success: false, message: 'Thiếu hoặc sai số tiền (amount)' };
        return next();
    }

    console.log('Fake payment via GET (query):', query);

    // Lưu lịch sử nếu cần (tùy chọn)
    try {
        await CardPayment.payment({
            app_name: query.app_name || 'APPost',
            amount: amount,
            order_id: query.order_id || '',
            order_info: query.order_info || '',
            currency: query.currency || 'VND',
        });
    } catch (e) {
        console.log('Lưu lịch sử thất bại:', e.message);
    }

    // Tạo URL trả về
    const returnUrl = query.return_url || 'https://ap-post.vercel.app/order-success';
    const orderId = query.order_id || 'unknown';

    const successUrl = `${returnUrl}?orderId=${orderId}&status=success&message=Thanh%20toán%20thành%20công`;

    // Redirect ngay về trang thành công
    ctx.redirect(successUrl);
});

// Giữ lại POST để tương thích cũ (nếu cần)
router.post('/', async (ctx, next) => {
    const body = ctx.request.body;
    const amount = body.amount ? parseFloat(body.amount) : 0;

    console.log("body: " + body);
    console.log("amount: " + amount);
    

    if (!amount || amount <= 0) {
        ctx.response.status = StatusCodes.BAD_REQUEST;
        ctx.body = { success: false, message: 'Thiếu hoặc sai số tiền (amount)' };
        return next();
    }

    const returnUrl = body.return_url || 'https://ap-post.vercel.app/order-success';
    const orderId = body.order_id || 'unknown';
    const successUrl = `${returnUrl}?orderId=${orderId}&status=success&message=Thanh%20toán%20thành%20công`;

    ctx.body = {
        success: true,
        message: 'Thanh toán thành công (giả lập)',
        data: {
            payment_id: Date.now().toString(),
            redirect_to: successUrl
        }
    };
});
module.exports = router;