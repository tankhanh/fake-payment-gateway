const fs = require('fs');
const path = require('path');

const CardPayment = {
    payment : async (transactionData) =>
    {
        const transactionDataObj = JSON.stringify(transactionData);

        const data = fs.readFileSync(path.resolve('data/card-transaction.json'));
        const json = JSON.parse(data);
        const transactionalJson = JSON.parse(transactionDataObj);

        // Thêm timestamp để history chi tiết
        transactionalJson.timestamp = new Date().toISOString();

        json.push(transactionalJson);

        fs.writeFileSync(path.resolve('data/card-transaction.json'), JSON.stringify(json));

        return {
            message : 'transaction is successful',
        };
    },
    history : async () =>
    {
        const data = fs.readFileSync(path.resolve('data/card-transaction.json'));
        const json = JSON.parse(data);

        return json;
    },
};

module.exports = CardPayment;