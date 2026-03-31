const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'velvora',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres'
});

// Email Configuration (Gmail SMTP)
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Email templates
function getStatusEmailTemplate(order, newStatus) {
  const statusMessages = {
    'Processing': {
      subject: `Your Order ${order.order_id} is Being Processed`,
      greeting: 'Great news!',
      message: 'Your order is now being processed by our team. We will notify you when it ships.'
    },
    'Shipped': {
      subject: `Your Order ${order.order_id} Has Shipped!`,
      greeting: 'Your order is on its way!',
      message: 'Your order has been shipped. You can track your package using the tracking information in your account.'
    },
    'Delivered': {
      subject: `Your Order ${order.order_id} Has Been Delivered!`,
      greeting: 'Your order has arrived!',
      message: 'Your order has been delivered. We hope you love your purchase! Please leave a review.'
    },
    'Cancelled': {
      subject: `Order ${order.order_id} Cancelled`,
      greeting: 'Order Cancelled',
      message: 'Your order has been cancelled. If you have any questions, please contact our support team.'
    }
  };

  const template = statusMessages[newStatus] || {
    subject: `Order ${order.order_id} Status Update`,
    greeting: 'Hello!',
    message: `Your order status has been updated to: ${newStatus}`
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Poppins', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #c8a96a 0%, #d4b87a 100%); padding: 30px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
    .content { padding: 30px; }
    .order-details { background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .order-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .order-row:last-child { border-bottom: none; font-weight: 600; }
    .status-badge { display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: 600; text-transform: uppercase; font-size: 14px; }
    .status-processing { background: #fff3cd; color: #856404; }
    .status-shipped { background: #cce5ff; color: #004085; }
    .status-delivered { background: #d4edda; color: #155724; }
    .status-cancelled { background: #f8d7da; color: #721c24; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .items-list { margin-top: 15px; }
    .item-row { display: flex; justify-content: space-between; padding: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>VELVORA LUXURY</h1>
    </div>
    <div class="content">
      <h2>${template.greeting}</h2>
      <p>${template.message}</p>
      
      <div class="status-badge status-${newStatus.toLowerCase()}">${newStatus}</div>
      
      <div class="order-details">
        <h3>Order Details</h3>
        <div class="order-row">
          <span>Order ID:</span>
          <span>${order.order_id}</span>
        </div>
        <div class="order-row">
          <span>Customer:</span>
          <span>${order.customer_name}</span>
        </div>
        <div class="order-row">
          <span>Email:</span>
          <span>${order.customer_email}</span>
        </div>
        <div class="order-row">
          <span>Total:</span>
          <span>₹${parseFloat(order.total).toLocaleString('en-IN')}</span>
        </div>
        <div class="order-row">
          <span>Payment:</span>
          <span>${order.payment_method?.toUpperCase() || 'N/A'}</span>
        </div>
      </div>
      
      ${order.items ? `<div class="items-list"><strong>Items:</strong>${JSON.parse(order.items).map(item => `<div class="item-row"><span>${item.name} x${item.quantity}</span><span>₹${(item.price * item.quantity).toLocaleString('en-IN')}</span></div>`).join('')}</div>` : ''}
      
      <p style="margin-top: 20px;">Thank you for shopping with Velvora Luxury!</p>
    </div>
    <div class="footer">
      <p>Velvora Luxury | Premium Fashion Store</p>
      <p>Contact: support@velvora.com</p>
    </div>
  </div>
</body>
</html>`;
}

// Send email function
async function sendOrderStatusEmail(order, newStatus) {
  try {
    const htmlContent = getStatusEmailTemplate(order, newStatus);
    const template = {
      'Processing': `Your Order ${order.order_id} is Being Processed`,
      'Shipped': `Your Order ${order.order_id} Has Shipped!`,
      'Delivered': `Your Order ${order.order_id} Has Been Delivered!`,
      'Cancelled': `Order ${order.order_id} Cancelled`
    };

    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM || '"Velvora Luxury" <noreply@velvora.com>',
      to: order.customer_email,
      subject: template[newStatus] || `Order ${order.order_id} Status Update`,
      html: htmlContent
    });
    
    console.log(`✓ Email sent to ${order.customer_email} for order ${order.order_id} (${newStatus})`);
    return true;
  } catch (error) {
    console.error('Email send error:', error.message);
    return false;
  }
}

// Test connection
pool.query('SELECT NOW()')
  .then(() => console.log('✓ Connected to PostgreSQL'))
  .catch(err => console.error('PostgreSQL connection error:', err.message));

// PayU Configuration
const PAYU_KEY = process.env.PAYU_KEY || 'gtKFFx';
const PAYU_SALT = process.env.PAYU_SALT || 'eCwWELxi';
const PAYU_TEST = process.env.PAYU_TEST !== 'false';
const PAYU_URL = PAYU_TEST ? 'https://test.payu.in/_payment' : 'https://secure.payu.in/_payment';

function generatePayUHash(data) {
  const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${PAYU_SALT}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
}

// ============ API Routes ============

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST product
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, original_price, category, image, stock, sizes, colors, tag } = req.body;
    const result = await pool.query(
      `INSERT INTO products (name, description, price, original_price, category, image, stock, sizes, colors, tag) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, description, price, original_price, category, image, stock, JSON.stringify(sizes), JSON.stringify(colors), tag]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, description, price, original_price, category, image, stock, sizes, colors, tag } = req.body;
    await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, original_price=$4, category=$5, image=$6, stock=$7, sizes=$8, colors=$9, tag=$10 WHERE id=$11`,
      [name, description, price, original_price, category, image, stock, JSON.stringify(sizes), JSON.stringify(colors), tag, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ORDERS ============

// GET all orders
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json({ orders: result.rows, total: result.rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single order
app.get('/api/orders/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST order
app.post('/api/orders', async (req, res) => {
  try {
    const { orderId, customerName, customerEmail, customerPhone, items, subtotal, tax, shipping, total, paymentMethod, shippingAddress, status } = req.body;
    const result = await pool.query(
      `INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, items, subtotal, tax, shipping, total, payment_method, shipping_address, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [orderId, customerName, customerEmail, customerPhone, JSON.stringify(items), subtotal, tax, shipping, total, paymentMethod, JSON.stringify(shippingAddress), status || 'Pending']
    );
    res.json({ success: true, orderId, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT order status - WITH EMAIL NOTIFICATION
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status, orderId } = req.body;
    
    // Get current order before update
    const currentOrder = orderId 
      ? await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId])
      : await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    
    if (currentOrder.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = currentOrder.rows[0];
    const oldStatus = order.status;
    
    // Update status
    const updateQuery = orderId 
      ? await pool.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE order_id = $2 RETURNING *', [status, orderId])
      : await pool.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, req.params.id]);
    
    const updatedOrder = updateQuery.rows[0];
    
    // Send email notification if status changed
    if (oldStatus !== status && updatedOrder.customer_email) {
      const emailSent = await sendOrderStatusEmail(updatedOrder, status);
      return res.json({ 
        success: true, 
        order: updatedOrder, 
        emailSent,
        message: emailSent ? 'Status updated and email sent' : 'Status updated but email failed'
      });
    }
    
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT order (general update)
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status, ...otherFields } = req.body;
    
    if (status) {
      // Get current order
      const currentOrder = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
      if (currentOrder.rows.length > 0) {
        const order = currentOrder.rows[0];
        const oldStatus = order.status;
        
        await pool.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2', [status, req.params.id]);
        
        // Send email on status change
        if (oldStatus !== status && order.customer_email) {
          await sendOrderStatusEmail({ ...order, status }, status);
        }
      }
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ USERS (LIVE FROM POSTGRESQL) ============

// GET all users/customers
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.*, 
             COUNT(o.id) as total_orders,
             COALESCE(SUM(o.total), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON o.customer_email = u.email
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Users error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET single user
app.get('/api/users/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST user (register)
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
      [name, email, password, phone]
    );
    res.json({ success: true, ...result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// POST login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows[0]) {
      const user = result.rows[0];
      res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ADDRESSES ============

app.get('/api/addresses', async (req, res) => {
  try {
    const userId = req.query.userId;
    const result = await pool.query('SELECT * FROM addresses WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/addresses', async (req, res) => {
  try {
    const { userId, label, fullAddress, city, postalCode, country } = req.body;
    const result = await pool.query(
      `INSERT INTO addresses (user_id, label, full_address, city, postal_code, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, label, fullAddress, city, postalCode, country]
    );
    res.json({ success: true, ...result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/addresses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM addresses WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PAYU PAYMENT ============

app.post('/api/payment/init', async (req, res) => {
  try {
    const { amount, email, firstname, phone, productinfo } = req.body;
    const txnid = 'VEL' + Date.now();

    const paymentData = {
      key: PAYU_KEY,
      txnid: txnid,
      amount: amount.toString(),
      productinfo: productinfo || 'Order from Velvora Luxury',
      firstname: firstname || 'Customer',
      email: email || 'customer@email.com',
      phone: phone || '9999999999'
    };

    const hash = generatePayUHash(paymentData);

    res.json({
      success: true,
      payuUrl: PAYU_URL,
      txnid: txnid,
      hash: hash,
      ...paymentData
    });
  } catch (err) {
    console.error('PayU init error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/payment/verify', async (req, res) => {
  try {
    const { txnid, status, mihpayid } = req.body;

    if (status === 'success') {
      const result = await pool.query(
        `UPDATE orders SET payment_status = 'success', mihpayid = $1 WHERE order_id = $2 RETURNING *`,
        [mihpayid, txnid]
      );
      
      // Send confirmation email
      if (result.rows.length > 0) {
        await sendOrderStatusEmail(result.rows[0], 'Processing');
      }
      
      res.json({ success: true, status: 'success', order: result.rows[0] });
    } else {
      res.json({ success: false, status: status });
    }
  } catch (err) {
    console.error('PayU verify error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ STATS API ============

app.get('/api/stats', async (req, res) => {
  try {
    const orders = await pool.query('SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as revenue FROM orders');
    const users = await pool.query('SELECT COUNT(*) as total FROM users');
    const products = await pool.query('SELECT COUNT(*) as total FROM products');
    
    res.json({
      totalOrders: parseInt(orders.rows[0].total),
      totalRevenue: parseFloat(orders.rows[0].revenue),
      totalCustomers: parseInt(users.rows[0].total),
      totalProducts: parseInt(products.rows[0].total)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ DATABASE DUMP ============

app.get('/api/dump', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    const products = await pool.query('SELECT * FROM products');
    const orders = await pool.query('SELECT * FROM orders');
    const addresses = await pool.query('SELECT * FROM addresses');
    res.json({
      users: users.rows,
      products: products.rows,
      orders: orders.rows,
      addresses: addresses.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static files
app.use(express.static('.'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  PostgreSQL Server running at http://localhost:${PORT}`);
  console.log(`========================================`);
  console.log(`\nAPI Endpoints:`);
  console.log(`  GET    /api/products     - All products`);
  console.log(`  POST   /api/products     - Add product`);
  console.log(`  GET    /api/orders       - All orders`);
  console.log(`  POST   /api/orders       - Create order`);
  console.log(`  PUT    /api/orders/:id/status - Update status (sends email)`);
  console.log(`  GET    /api/users        - All customers (with stats)`);
  console.log(`  POST   /api/login        - User login`);
  console.log(`  GET    /api/stats        - Dashboard stats`);
  console.log(`  POST   /api/payment/init - Initialize PayU`);
  console.log(`  POST   /api/payment/verify - Verify PayU`);
  console.log(`  GET    /api/dump         - All data`);
  console.log(`\nEmail: ${process.env.EMAIL_USER || 'Not configured'}`);
  console.log(`PayU: ${PAYU_TEST ? 'TEST' : 'PRODUCTION'}`);
  console.log(`========================================\n`);
});
