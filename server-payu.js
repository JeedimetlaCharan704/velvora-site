const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PAYU_KEY = process.env.PAYU_KEY || 'gtKFFx';
const PAYU_SALT = process.env.PAYU_SALT || 'eCwWELxi';
const PAYU_URL = process.env.PAYU_TEST === 'true' 
    ? 'https://test.payu.in/_payment' 
    : 'https://secure.payu.in/_payment';
const PAYU_VERIFY_URL = process.env.PAYU_TEST === 'true'
    ? 'https://test.payu.in/merchant/postservice.php?form=2'
    : 'https://info.payu.in/merchant/postservice.php?form=2';

const DATA_DIR = './data';
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const initData = () => {
    const products = require('./data/products.json');
    if (!fs.existsSync('./data/orders.json')) {
        fs.writeFileSync('./data/orders.json', JSON.stringify([], null, 2));
    }
    if (!fs.existsSync('./data/users.json')) {
        fs.writeFileSync('./data/users.json', JSON.stringify([], null, 2));
    }
};

initData();

function generateHash(data) {
    const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${PAYU_SALT}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
}

function verifyHash(data, salt) {
    const hashString = `${data.status}|||||||||||${salt}|${data.key}`;
    const reverseHash = crypto.createHash('sha512').update(hashString).digest('hex');
    return data.hash === reverseHash;
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = req.url.split('?')[0];

    if (url === '/api/products') {
        if (req.method === 'GET') {
            const products = require('./data/products.json');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products));
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const products = require('./data/products.json');
                const product = JSON.parse(body);
                product._id = Date.now().toString();
                product.createdAt = new Date().toISOString();
                products.push(product);
                fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(product));
            });
        } else {
            res.writeHead(405);
            res.end();
        }
        return;
    }

    if (url === '/api/payment/init') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    const txnid = 'VEL' + Date.now();
                    
                    const productinfo = data.items ? 
                        data.items.slice(0, 3).map(i => i.name).join(', ') + (data.items.length > 3 ? '...' : '') :
                        'Order from Velvora Luxury';

                    const paymentData = {
                        key: PAYU_KEY,
                        txnid: txnid,
                        amount: data.amount.toString(),
                        productinfo: productinfo,
                        firstname: data.firstname || 'Customer',
                        email: data.email || 'customer@email.com',
                        phone: data.phone || '9999999999',
                        surl: data.successUrl || 'http://localhost:3000/order-success.html',
                        furl: data.failureUrl || 'http://localhost:3000/checkout.html',
                        curl: data.cancelUrl || 'http://localhost:3000/checkout.html'
                    };

                    const hash = generateHash(paymentData);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        payuUrl: PAYU_URL,
                        txnid: txnid,
                        hash: hash,
                        ...paymentData
                    }));
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: e.message }));
                }
            });
        }
        return;
    }

    if (url === '/api/payment/verify') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    const params = new URLSearchParams(body);
                    const data = Object.fromEntries(params);

                    if (verifyHash(data, PAYU_SALT)) {
                        const isSuccess = data.status === 'success';
                        
                        if (isSuccess) {
                            const orders = JSON.parse(fs.readFileSync('./data/orders.json', 'utf8'));
                            const newOrder = {
                                _id: data.txnid,
                                orderId: data.txnid,
                                customerName: data.firstname,
                                customerEmail: data.email,
                                customerPhone: data.phone,
                                mihpayid: data.mihpayid,
                                total: parseFloat(data.amount),
                                status: 'Pending',
                                createdAt: new Date().toISOString(),
                                paymentStatus: 'success',
                                paymentSource: data.payment_source,
                                pgType: data.PG_TYPE
                            };
                            orders.unshift(newOrder);
                            fs.writeFileSync('./data/orders.json', JSON.stringify(orders, null, 2));
                        }

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: isSuccess,
                            status: data.status,
                            txnid: data.txnid,
                            mihpayid: data.mihpayid,
                            amount: data.amount
                        }));
                    } else {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Invalid hash' }));
                    }
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: e.message }));
                }
            });
        }
        return;
    }

    if (url === '/api/orders') {
        if (req.method === 'GET') {
            const orders = JSON.parse(fs.readFileSync('./data/orders.json', 'utf8'));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ orders, total: orders.length }));
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const orders = JSON.parse(fs.readFileSync('./data/orders.json', 'utf8'));
                const orderData = JSON.parse(body);
                orderData._id = 'ORD' + Date.now();
                orderData.orderId = orderData._id;
                orderData.status = 'Pending';
                orderData.createdAt = new Date().toISOString();
                orders.unshift(orderData);
                fs.writeFileSync('./data/orders.json', JSON.stringify(orders, null, 2));
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ order: orderData }));
            });
        } else {
            res.writeHead(405);
            res.end();
        }
        return;
    }

    if (url === '/api/users') {
        if (req.method === 'GET') {
            const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
        } else {
            res.writeHead(405);
            res.end();
        }
        return;
    }

    if (url === '/api/payment/verify-txn') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    const { txnid } = JSON.parse(body);
                    const command = 'verify_payment';
                    const var1 = txnid;
                    const hashString = `${command}|${var1}|${PAYU_SALT}`;
                    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

                    const postData = `key=${PAYU_KEY}&command=${command}&hash=${hash}&var1=${var1}`;

                    const verifyUrl = new URL(PAYU_VERIFY_URL);
                    const options = {
                        hostname: verifyUrl.hostname,
                        port: 443,
                        path: verifyUrl.pathname + verifyUrl.search,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Content-Length': Buffer.byteLength(postData)
                        }
                    };

                    const https = require('https');
                    const verifyReq = https.request(options, (verifyRes) => {
                        let data = '';
                        verifyRes.on('data', chunk => data += chunk);
                        verifyRes.on('end', () => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data);
                        });
                    });

                    verifyReq.on('error', (e) => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: e.message }));
                    });

                    verifyReq.write(postData);
                    verifyReq.end();
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: e.message }));
                }
            });
        }
        return;
    }

    let filePath = '.' + url;
    if (filePath === './') filePath = './index.html';
    
    const extname = path.extname(filePath);
    const contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };

    const contentType = contentTypes[extname] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('API endpoints:');
    console.log('  GET    /api/products');
    console.log('  POST   /api/products');
    console.log('  GET    /api/orders');
    console.log('  POST   /api/orders');
    console.log('  POST   /api/payment/init');
    console.log('  POST   /api/payment/verify');
    console.log('  POST   /api/payment/verify-txn');
    console.log(`PayU Environment: ${process.env.PAYU_TEST === 'true' ? 'TEST' : 'PRODUCTION'}`);
});

module.exports = server;
