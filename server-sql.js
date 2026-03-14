const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new Database('velvora.db');

// Create Tables
db.exec(`
  -- Users Table
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Products Table
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    original_price REAL,
    category TEXT NOT NULL,
    image TEXT,
    stock INTEGER DEFAULT 0,
    sizes TEXT,
    colors TEXT,
    tag TEXT,
    rating REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Orders Table
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT UNIQUE NOT NULL,
    customer_id INTEGER,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    items TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    shipping REAL DEFAULT 0,
    total REAL NOT NULL,
    payment_method TEXT,
    shipping_address TEXT,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id)
  );

  -- Addresses Table
  CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    label TEXT,
    full_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'US',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Order Items Table
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT,
    size TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

// Insert sample data if tables are empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  // Insert sample admin user
  db.prepare(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`).run('Admin', 'admin@velvora.com', 'admin123', 'admin');
  db.prepare(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`).run('Demo User', 'user@velvora.com', 'user123', 'user');
  
  // Insert sample products
  const products = [
    ['Silk Evening Gown', 'Elegant silk evening gown perfect for special occasions', 299.99, 399.99, 'women', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 15, 'XS,S,M,L,XL', 'Black,Navy,Burgundy', 'new', 5],
    ['Premium Leather Jacket', 'Genuine leather jacket with modern fit', 449.99, 549.99, 'men', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 20, 'S,M,L,XL,XXL', 'Black,Brown', 'new', 5],
    ['Designer Sunglasses', 'Luxury designer sunglasses with UV protection', 189.99, 249.99, 'accessories', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 50, '', 'Gold,Silver,Black', 'sale', 4],
    ['Cashmere Sweater', '100% cashmere sweater for ultimate comfort', 199.99, 279.99, 'women', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', 25, 'XS,S,M,L,XL', 'Cream,Gray,Pink,Blue', 'new', 5],
    ['Classic Denim Jeans', 'Premium denim jeans with perfect fit', 89.99, 129.99, 'men', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400', 100, '28,30,32,34,36', 'Blue,Black', 'sale', 4],
    ['Floral Summer Dress', 'Beautiful floral print summer dress', 79.99, 99.99, 'women', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 50, 'XS,S,M,L', 'Pink,Blue,White', 'new', 4],
    ['Leather Belt', 'Genuine leather belt with silver buckle', 49.99, 69.99, 'accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 75, 'S,M,L,XL', 'Black,Brown', 'sale', 4],
    ['Kids Party Wear', 'Elegant party wear for kids', 59.99, 79.99, 'kids', 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400', 30, '2-3Y,4-5Y,6-7Y,8-9Y', 'Red,Blue,Pink', 'new', 5],
    ['Wool Blazer', 'Premium wool blend blazer for formal occasions', 349.99, 449.99, 'men', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', 18, 'S,M,L,XL,XXL', 'Navy,Charcoal,Black', 'new', 5],
    ['Pearl Earrings', 'Elegant freshwater pearl earrings', 89.99, 119.99, 'accessories', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', 60, '', 'White,Pink,Black', 'new', 4]
  ];
  
  const insertProduct = db.prepare(`INSERT INTO products (name, description, price, original_price, category, image, stock, sizes, colors, tag, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  products.forEach(p => insertProduct.run(...p));

  // Insert sample orders
  const orderId1 = 'VEL-' + Date.now();
  const orderId2 = 'VEL-' + (Date.now() - 86400000);
  const orderId3 = 'VEL-' + (Date.now() - 172800000);
  
  db.prepare(`INSERT INTO orders (order_id, customer_name, customer_email, items, subtotal, tax, shipping, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    orderId1, 'John Doe', 'john@example.com', JSON.stringify([{name: 'Silk Evening Gown', price: 299.99, quantity: 1}]), 299.99, 24.00, 0, 323.99, 'Pending'
  );
  db.prepare(`INSERT INTO orders (order_id, customer_name, customer_email, items, subtotal, tax, shipping, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    orderId2, 'Jane Smith', 'jane@example.com', JSON.stringify([{name: 'Premium Leather Jacket', price: 449.99, quantity: 1}]), 449.99, 36.00, 0, 485.99, 'Processing'
  );
  db.prepare(`INSERT INTO orders (order_id, customer_name, customer_email, items, subtotal, tax, shipping, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    orderId3, 'Mike Johnson', 'mike@example.com', JSON.stringify([{name: 'Designer Sunglasses', price: 189.99, quantity: 1}]), 189.99, 15.20, 0, 205.19, 'Shipped'
  );

  console.log('Sample data inserted');
}

// ============ API Routes ============

// GET all products
app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(products);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(product);
});

// POST product
app.post('/api/products', (req, res) => {
  const { name, description, price, originalPrice, category, image, stock, sizes, colors, tag } = req.body;
  const result = db.prepare(`INSERT INTO products (name, description, price, original_price, category, image, stock, sizes, colors, tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    name, description, price, originalPrice, category, image, stock, sizes, colors, tag
  );
  res.json({ id: result.lastInsertRowid, ...req.body });
});

// PUT product
app.put('/api/products/:id', (req, res) => {
  const { name, description, price, originalPrice, category, image, stock, sizes, colors, tag } = req.body;
  db.prepare(`UPDATE products SET name = ?, description = ?, price = ?, original_price = ?, category = ?, image = ?, stock = ?, sizes = ?, colors = ?, tag = ? WHERE id = ?`).run(
    name, description, price, originalPrice, category, image, stock, sizes, colors, tag, req.params.id
  );
  res.json({ success: true });
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// GET all orders
app.get('/api/orders', (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json({ orders, total: orders.length });
});

// GET single order
app.get('/api/orders/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json(order);
});

// POST order
app.post('/api/orders', (req, res) => {
  const { orderId, customerName, customerEmail, customerPhone, items, subtotal, tax, shipping, total, paymentMethod, shippingAddress, status } = req.body;
  const result = db.prepare(`INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, items, subtotal, tax, shipping, total, payment_method, shipping_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    orderId, customerName, customerEmail, customerPhone, JSON.stringify(items), subtotal, tax, shipping, total, paymentMethod, JSON.stringify(shippingAddress), status || 'Pending'
  );
  res.json({ success: true, orderId, id: result.lastInsertRowid });
});

// PUT order status
app.put('/api/orders/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

// DELETE order
app.delete('/api/orders/:id', (req, res) => {
  db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// GET all users
app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

// POST user (register)
app.post('/api/users', (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const result = db.prepare(`INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)`).run(name, email, password, phone);
    res.json({ success: true, id: result.lastInsertRowid, name, email, role: 'user' });
  } catch (e) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// POST login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
  if (user) {
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// GET addresses
app.get('/api/addresses', (req, res) => {
  const userId = req.query.userId;
  const addresses = db.prepare('SELECT * FROM addresses WHERE user_id = ?').all(userId);
  res.json(addresses);
});

// POST address
app.post('/api/addresses', (req, res) => {
  const { userId, label, fullAddress, city, postalCode, country } = req.body;
  const result = db.prepare(`INSERT INTO addresses (user_id, label, full_address, city, postal_code, country) VALUES (?, ?, ?, ?, ?, ?)`).run(userId, label, fullAddress, city, postalCode, country);
  res.json({ success: true, id: result.lastInsertRowid });
});

// DELETE address
app.delete('/api/addresses/:id', (req, res) => {
  db.prepare('DELETE FROM addresses WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Get SQL dump for DBMS project
app.get('/api/dump', (req, res) => {
  const tables = ['users', 'products', 'orders', 'addresses'];
  const dump = {};
  tables.forEach(table => {
    dump[table] = db.prepare(`SELECT * FROM ${table}`).all();
  });
  res.json(dump);
});

// Serve static files
app.use(express.static('.'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SQL Server running at http://localhost:${PORT}`);
  console.log('Database: velvora.db (SQLite)');
  console.log('\nAPI Endpoints:');
  console.log('  GET  /api/products     - All products');
  console.log('  POST /api/products    - Add product');
  console.log('  GET  /api/orders      - All orders');
  console.log('  POST /api/orders     - Create order');
  console.log('  PUT  /api/orders/:id  - Update order status');
  console.log('  GET  /api/users       - All users');
  console.log('  POST /api/login       - User login');
  console.log('  GET  /api/dump        - SQL data dump for DBMS');
});
