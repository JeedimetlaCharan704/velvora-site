const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL Connection - UPDATE THESE WITH YOUR pgAdmin DETAILS
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'velvora',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres'
});

// Test connection
pool.query('SELECT NOW()')
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('PostgreSQL connection error:', err));

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

// PUT order status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, req.params.id]);
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

// ============ USERS ============

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(result.rows);
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

// ============ DEMO PAYMENT (Replaces PayU) ============

// Initialize Demo Payment
app.post('/api/payment/init', async (req, res) => {
  try {
    const { amount, email, firstname, phone, productinfo, paymentMethod } = req.body;
    const txnid = 'DEMO' + Date.now();

    if (paymentMethod === 'cod' || paymentMethod === 'demo') {
      res.json({
        success: true,
        paymentMode: 'demo',
        txnid: txnid,
        amount: amount,
        status: 'pending'
      });
    } else {
      res.json({
        success: true,
        paymentMode: 'demo',
        txnid: txnid,
        amount: amount,
        status: 'pending'
      });
    }
  } catch (err) {
    console.error('Payment init error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Process Demo Payment
app.post('/api/payment/process', async (req, res) => {
  try {
    const { txnid, amount, cardLastFour, paymentMethod } = req.body;
    
    const success = Math.random() > 0.1;

    if (success) {
      res.json({
        success: true,
        status: 'success',
        txnid: txnid,
        message: 'Payment processed successfully (Demo Mode)',
        amount: amount
      });
    } else {
      res.json({
        success: false,
        status: 'failed',
        txnid: txnid,
        message: 'Payment failed (Demo Mode - 10% failure rate for testing)'
      });
    }
  } catch (err) {
    console.error('Payment process error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify Payment
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { txnid, status } = req.body;

    res.json({
      success: status === 'success',
      status: status,
      txnid: txnid
    });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ success: false, error: err.message });
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
  console.log(`PostgreSQL Server running at http://localhost:${PORT}`);
  console.log(`Payment Mode: DEMO (PayU Removed)`);
  console.log('\nAPI Endpoints:');
  console.log('  GET    /api/products     - All products');
  console.log('  POST   /api/products     - Add product');
  console.log('  GET    /api/orders       - All orders');
  console.log('  POST   /api/orders       - Create order');
  console.log('  GET    /api/users        - All users');
  console.log('  POST   /api/login        - User login');
  console.log('  POST   /api/payment/init - Initialize Demo Payment');
  console.log('  POST   /api/payment/process - Process Demo Payment');
  console.log('  POST   /api/payment/verify - Verify Payment');
  console.log('  GET    /api/dump         - All data');
});
