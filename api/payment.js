const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
    const fs = require('fs');
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

module.exports = async function handler(req, res) {
    ensureDataDir();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

    try {
        if (req.method === 'POST' && req.url.includes('init')) {
            const { amount, email, firstname, phone, productinfo, paymentMethod } = req.body;
            
            const txnid = 'DEMO' + Date.now();

            return res.status(200).json({
                success: true,
                paymentMode: 'demo',
                txnid: txnid,
                amount: amount,
                status: 'pending'
            });
        }

        if (req.method === 'POST' && req.url.includes('process')) {
            const { txnid, amount, paymentMethod } = req.body;
            
            const success = Math.random() > 0.1;

            if (success) {
                return res.status(200).json({
                    success: true,
                    status: 'success',
                    txnid: txnid,
                    message: 'Payment processed successfully (Demo Mode)',
                    amount: amount
                });
            } else {
                return res.status(200).json({
                    success: false,
                    status: 'failed',
                    txnid: txnid,
                    message: 'Payment failed (Demo Mode - 10% failure rate for testing)'
                });
            }
        }

        if (req.method === 'POST' && req.url.includes('verify')) {
            const { txnid } = req.body;
            
            return res.status(200).json({
                success: true,
                status: 'success',
                txnid: txnid
            });
        }

        return res.status(400).json({ error: 'Invalid endpoint' });
    } catch (error) {
        console.error('Payment API Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
