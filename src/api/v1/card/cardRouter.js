const Router = require('koa-router');
const StatusCodes = require('http-status-codes');
const { CardPayment } = require('../../../services');
const { Response } = require('../../../types');

const router = new Router({
    prefix: '/api/v1/payment/card',
});

// Lịch sử giao dịch (giữ nguyên)
router.get('/', async (ctx, next) => {
    const response = new Response();
    const data = await CardPayment.history();

    response.success = true;
    response.message = 'Transaction history.';
    response.data = { data };
    ctx.response.status = StatusCodes.OK;
    ctx.body = response;
    next().then();
});

// THANH TOÁN GIẢ LẬP - SIÊU ĐƠN GIẢN CHO TEST
router.post('/', async (ctx, next) => {
    const body = ctx.request.body;
    const response = new Response();

    // CHỈ CẦN CÓ AMOUNT LÀ CHO QUA LUÔN (KHÔNG CẦN EMAIL, KHÔNG CẦN CARD)
    if (!body.amount || parseFloat(body.amount) <= 0) {
        ctx.response.status = StatusCodes.BAD_REQUEST;
        response.success = false;
        response.message = 'Thiếu hoặc sai số tiền (amount)';
        ctx.body = response;
        return next();
    }

    console.log('Fake payment requested:', body);

    // Lưu giao dịch vào file JSON (giữ nguyên chức năng cũ)
    try {
        const fakeCardData = {
            app_name: body.app_name || 'APPost',
            service: body.service || 'Vận chuyển',
            customer_email: body.customer_email || 'khongco@email.com',
            card_holder_name: body.card_holder_name || 'Khách hàng',
            amount: body.amount,
            currency: body.currency || 'VND',
            order_id: body.order_id || '',
            order_info: body.order_info || '',
        };
        await CardPayment.payment(fakeCardData);
    } catch (e) {
        console.log('Lưu lịch sử thất bại (không sao):', e.message);
    }

    // Tạo URL callback
    const returnUrl = body.return_url || 'https://ap-post.vercel.app';
    const orderId = body.order_id || 'unknown';

    const successUrl = `${returnUrl}?order_id=${orderId}&status=success&message=Thanh%20toán%20thành%20công`;
    // const failUrl = `${returnUrl}?order_id=${orderId}&status=failed&message=Thanh%20toán%20thất%20bại`;

    // TRẢ VỀ KẾT QUẢ THÀNH CÔNG NGAY + URL ĐỂ FRONTEND TỰ REDIRECT
    response.success = true;
    response.message = 'Thanh toán thành công (giả lập)';
    response.data = {
        payment_id: Date.now().toString(),
        order_id: orderId,
        amount: body.amount,
        currency: body.currency || 'VND',
        redirect_to: successUrl,  // ← Frontend sẽ tự redirect về đây
    };

    ctx.response.status = StatusCodes.OK;
    ctx.body = response;
    next().then();
});

module.exports = router;