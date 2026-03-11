const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const initData = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  const ordersPath = path.join(DATA_DIR, 'orders.json');
  if (!fs.existsSync(ordersPath)) {
    const orders = [
      { _id: "1", orderId: "VEL-001", customer: { name: "John Doe", email: "john@example.com" }, createdAt: new Date().toISOString(), total: 299.99, status: "Pending", items: [{ name: "Silk Evening Gown", price: 299.99, quantity: 1 }] },
      { _id: "2", orderId: "VEL-002", customer: { name: "Jane Smith", email: "jane@example.com" }, createdAt: new Date(Date.now() - 86400000).toISOString(), total: 449.99, status: "Processing", items: [{ name: "Premium Leather Jacket", price: 449.99, quantity: 1 }] },
      { _id: "3", orderId: "VEL-003", customer: { name: "Mike Johnson", email: "mike@example.com" }, createdAt: new Date(Date.now() - 172800000).toISOString(), total: 189.99, status: "Shipped", items: [{ name: "Designer Sunglasses", price: 189.99, quantity: 1 }] },
      { _id: "4", orderId: "VEL-004", customer: { name: "Sarah Wilson", email: "sarah@example.com" }, createdAt: new Date(Date.now() - 259200000).toISOString(), total: 599.99, status: "Delivered", items: [{ name: "Cashmere Sweater", price: 199.99, quantity: 2 }, { name: "Leather Belt", price: 49.99, quantity: 1 }] }
    ];
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  }
};

initData();

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ordersPath = path.join(DATA_DIR, 'orders.json');

  try {
    if (req.method === 'GET') {
      const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
      return res.status(200).json({ orders, total: orders.length });
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
        const order = JSON.parse(body);
        order._id = Date.now().toString();
        order.orderId = 'VEL-' + Date.now();
        order.createdAt = new Date().toISOString();
        order.status = 'Pending';
        orders.push(order);
        fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
        return res.status(201).json({ order });
      });
      return;
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
