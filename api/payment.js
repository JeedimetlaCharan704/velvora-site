const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function generateHash(data, salt) {
    const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${salt}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
}

module.exports = async function handler(req, res) {
    ensureDataDir();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const PAYU_KEY = process.env.PAYU_KEY || 'gtKFFx';
    const PAYU_SALT = process.env.PAYU_SALT || 'eCwWELxi';
    const PAYU_TEST = process.env.PAYU_TEST === 'true';
    const PAYU_URL = PAYU_TEST 
        ? 'https://test.payu.in/_payment' 
        : 'https://secure.payu.in/_payment';
    const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

    try {
        if (req.method === 'POST' && req.url.includes('init')) {
            const { amount, email, firstname, phone, productinfo, items } = req.body;
            
            const txnid = 'VEL' + Date.now();
            
            const paymentData = {
                key: PAYU_KEY,
                txnid: txnid,
                amount: amount.toString(),
                productinfo: productinfo || 'Order from Velvora Luxury',
                firstname: firstname || 'Customer',
                email: email || 'customer@email.com',
                phone: phone || '9999999999',
                surl: `${SITE_URL}/order-success.html`,
                furl: `${SITE_URL}/checkout.html?payment=failed`,
                curl: `${SITE_URL}/checkout.html`
            };

            const hash = generateHash(paymentData, PAYU_SALT);

            return res.status(200).json({
                success: true,
                payuUrl: PAYU_URL,
                txnid: txnid,
                hash: hash,
                ...paymentData
            });
        }

        if (req.method === 'POST' && req.url.includes('verify')) {
            const { txnid } = req.body;
            
            const ordersPath = path.join(DATA_DIR, 'orders.json');
            let orders = [];
            
            if (fs.existsSync(ordersPath)) {
                orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
            }
            
            const order = orders.find(o => o.orderId === txnid);
            
            if (order) {
                return res.status(200).json({
                    success: true,
                    status: order.paymentStatus || 'success',
                    txnid: txnid,
                    amount: order.total
                });
            }
            
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        return res.status(400).json({ error: 'Invalid endpoint' });
    } catch (error) {
        console.error('PayU API Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
