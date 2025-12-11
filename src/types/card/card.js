/**
 *             'app_name'            => 'ABC',
 *             'customer_email'      => 'john@gmail.com',
 *             'service'             => 'Electronic Items',
 *             'card_type'           => 'VISA',
 *             'card_holder_name'    => 'Example',
 *             'card_number'         => '4242424242424242',
 *             'expiryMonth'         => '01',
 *             'expiryYear'          => '2020',
 *             'cvv'                 => '123',
 *             'amount'              => '5000.00',
 *             'currency'            => 'USD',
 */

function Card() {
    this.app_name = '';
    this.service = 'Shipping Service';
    this.customer_email = '';
    this.card_type = 'VISA';
    this.card_holder_name = 'Test User';
    this.card_number = '4242424242424242';
    this.expiryMonth = '12';
    this.expiryYear = '2030';
    this.cvv = '123';
    this.amount = '';
    this.currency = 'VND';

    // CÁC FIELD MỚI BẠN GỬI TỪ APPPOST
    this.order_id = '';
    this.order_info = '';
    this.return_url = 'http://localhost:4200/payment-success';  // Fallback URL success (thay bằng domain frontend thật)
}

Card.prototype.isValid = function () {
    // Thêm check fields bắt buộc: amount > 0, và order_id (nếu cần)
    return this.amount && parseFloat(this.amount) > 0 && this.order_id && this.customer_email;
};

module.exports = Card;