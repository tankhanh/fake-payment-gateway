const Router = require('koa-router');
const StatusCodes = require('http-status-codes');
const { CardPayment, emailNotificationService } = require('../../../services');
const { Card, Response } = require('../../../types');

// Prefix all routes with: /auth
const router = new Router({
    prefix: '/api/v1/payment/card',
});

router.get('/', async (ctx, next) => {
    const response = new Response();

    const data = await CardPayment.history();

    response.success = true;
    response.message = `Transaction history.`;
    response.data = {
        data,
    };
    ctx.response.status = StatusCodes.OK;
    ctx.body = response;

    next().then();
});

router.post('/', async (ctx, next) => {
    const body = ctx.request.body;

    // Tạo object Card từ body (giờ đã hỗ trợ field mới)
    const request = Object.setPrototypeOf(body, Card.prototype);

    const response = new Response();

    // Kiểm tra hợp lệ (chỉ cần amount + email)
    if (!request.isValid()) {
        ctx.response.status = StatusCodes.BAD_REQUEST;
        response.success = false;
        response.message = "Amount và email là bắt buộc";
        ctx.body = response;
        return next();
    }

    console.log('Fake payment requested:', body);

    // Lưu vào file JSON (giữ nguyên logic cũ)
    const data = await CardPayment.payment(request);

    // Tạo URL callback từ return_url (nếu có)
    const returnUrl = body.return_url || 'https://ap-post.vercel.app';
    const orderId = body.order_id || 'unknown';
    const successUrl = `${returnUrl}?order_id=${orderId}&status=success&message=Thanh%20toán%20thành%20công`;
    const failUrl = `${returnUrl}?order_id=${orderId}&status=failed&message=Thanh%20toán%20thất%20bại`;

    // Gửi email (nếu có config)
    try {
        await emailNotificationService.sendReceiptEmail(
            body.app_name || 'APPost',
            body.customer_email,
            body.card_holder_name || 'Khách hàng',
            body.service || 'Vận chuyển',
            body.amount,
            body.amount,
        );
    } catch (e) {
        console.log('Email gửi thất bại (không sao, test thôi):', e.message);
    }

    // TRẢ VỀ RESPONSE ĐỂ FRONTEND TỰ REDIRECT
    response.success = true;
    response.message = 'Giao dịch thành công (giả lập)';
    response.data = {
        payment_id: Date.now().toString(),
        order_id: orderId,
        amount: body.amount,
        currency: body.currency || 'VND',
        // Dành cho frontend tự redirect
        redirect_to: successUrl,
        // Hoặc bạn có thể tạo trang HTML giả lập như repo gốc
        payment_page: `https://${ctx.host}/fake-card-payment?order_id=${orderId}&amount=${body.amount}&return_url=${encodeURIComponent(returnUrl)}`
    };

    ctx.response.status = StatusCodes.OK;
    ctx.body = response;

    next().then();
});

module.exports = router;
