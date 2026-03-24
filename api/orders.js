const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function ensureOrdersFile() {
    const ordersPath = path.join(DATA_DIR, 'orders.json');
    if (!fs.existsSync(ordersPath)) {
        fs.writeFileSync(ordersPath, JSON.stringify([], null, 2));
    }
    return path.join(DATA_DIR, 'orders.json');
}

module.exports = async function handler(req, res) {
    ensureDataDir();
    
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const ordersPath = ensureOrdersFile();

    try {
        if (req.method === 'GET') {
            const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
            return res.status(200).json({ orders, total: orders.length });
        }

        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
            const order = {
                id: Date.now().toString(),
                order_id: body.orderId || 'VEL-' + Date.now(),
                customer_name: body.customerName,
                customer_email: body.customerEmail,
                customer_phone: body.customerPhone,
                items: body.items || [],
                subtotal: body.subtotal,
                tax: body.tax || 0,
                shipping: body.shipping || 0,
                total: body.total,
                payment_method: body.paymentMethod || 'payu',
                payment_status: body.paymentStatus || 'pending',
                mihpayid: body.mihpayid,
                shipping_address: body.shippingAddress,
                status: body.status || 'Pending',
                created_at: new Date().toISOString()
            };
            orders.unshift(order);
            fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
            return res.status(201).json({ success: true, order });
        }

        if (req.method === 'PUT') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
            const index = orders.findIndex(o => o.id === req.query.id || o.order_id === req.query.id);
            if (index !== -1) {
                orders[index] = { ...orders[index], ...body, updated_at: new Date().toISOString() };
                fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
                return res.status(200).json({ success: true, order: orders[index] });
            }
            return res.status(404).json({ error: 'Order not found' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Orders API Error:', error);
        return res.status(500).json({ error: error.message });
    }
};
