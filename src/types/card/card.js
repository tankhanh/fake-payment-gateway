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
    this.return_url = '';
}

Card.prototype.isValid = function () {
    return this.amount && parseFloat(this.amount) > 0;
};

module.exports = Card;
