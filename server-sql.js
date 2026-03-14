const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'velvora.db');

let db;

async function initDB() {
  const SQL = await initSqlJs();
  
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
  
  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
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
    )
  `);
  
  db.run(`
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      label TEXT,
      full_address TEXT NOT NULL,
      city TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      country TEXT DEFAULT 'US',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Insert sample data if tables are empty
  const userCount = db.exec("SELECT COUNT(*) as count FROM users")[0]?.values[0][0] || 0;
  
  if (userCount === 0) {
    db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, ['Admin', 'admin@velvora.com', 'admin123', 'admin']);
    db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, ['Demo User', 'user@velvora.com', 'user123', 'user']);
    
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
    
    products.forEach(p => {
      db.run(`INSERT INTO products (name, description, price, original_price, category, image, stock, sizes, colors, tag, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, p);
    });

    const orderId1 = 'VEL-' + Date.now();
    const orderId2 = 'VEL-' + (Date.now() - 86400000);
    const orderId3 = 'VEL-' + (Date.now() - 172800000);
    
    db.run(`INSERT INTO orders (order_id, customer_name, customer_email, items, subtotal, tax, shipping, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      orderId1, 'John Doe', 'john@example.com', JSON.stringify([{name: 'Silk Evening Gown', price: 299.99, quantity: 1}]), 299.99, 24.00, 0, 323.99, 'Pending'
    ]);
    db.run(`INSERT INTO orders (order_id, customer_name, customer_email, items, subtotal, tax, shipping, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      orderId2, 'Jane Smith', 'jane@example.com', JSON.stringify([{name: 'Premium Leather Jacket', price: 449.99, quantity: 1}]), 449.99, 36.00, 0, 485.99, 'Processing'
    ]);
    db.run(`INSERT INTO orders (order_id, customer_name, customer_email, items, subtotal, tax, shipping, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      orderId3, 'Mike Johnson', 'mike@example.com', JSON.stringify([{name: 'Designer Sunglasses', price: 189.99, quantity: 1}]), 189.99, 15.20, 0, 205.19, 'Shipped'
    ]);
    
    saveDB();
    console.log('Sample data inserted');
  }
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const results = queryAll(sql, params);
  return results[0] || null;
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDB();
  return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0][0] };
}

// ============ API Routes ============

app.get('/api/products', (req, res) => {
  const products = queryAll('SELECT * FROM products ORDER BY created_at DESC');
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = queryOne('SELECT * FROM products WHERE id = ?', [req.params.id]);
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, description, price, originalPrice, category, image, stock, sizes, colors, tag } = req.body;
  const result = run(`INSERT INTO products (name, description, price, original_price, category, image, stock, sizes, colors, tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    name, description, price, originalPrice, category, image, stock, sizes, colors, tag
  ]);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.put('/api/products/:id', (req, res) => {
  const { name, description, price, originalPrice, category, image, stock, sizes, colors, tag } = req.body;
  run(`UPDATE products SET name = ?, description = ?, price = ?, original_price = ?, category = ?, image = ?, stock = ?, sizes = ?, colors = ?, tag = ? WHERE id = ?`, [
    name, description, price, originalPrice, category, image, stock, sizes, colors, tag, req.params.id
  ]);
  res.json({ success: true });
});

app.delete('/api/products/:id', (req, res) => {
  run('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

app.get('/api/orders', (req, res) => {
  const orders = queryAll('SELECT * FROM orders ORDER BY created_at DESC');
  res.json({ orders, total: orders.length });
});

app.get('/api/orders/:id', (req, res) => {
  const order = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const { orderId, customerName, customerEmail, customerPhone, items, subtotal, tax, shipping, total, paymentMethod, shippingAddress, status } = req.body;
  const result = run(`INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, items, subtotal, tax, shipping, total, payment_method, shipping_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    orderId, customerName, customerEmail, customerPhone, JSON.stringify(items), subtotal, tax, shipping, total, paymentMethod, JSON.stringify(shippingAddress), status || 'Pending'
  ]);
  res.json({ success: true, orderId, id: result.lastInsertRowid });
});

app.put('/api/orders/:id', (req, res) => {
  const { status } = req.body;
  run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ success: true });
});

app.delete('/api/orders/:id', (req, res) => {
  run('DELETE FROM orders WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

app.get('/api/users', (req, res) => {
  const users = queryAll('SELECT * FROM users ORDER BY created_at DESC');
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const result = run(`INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)`, [name, email, password, phone]);
    res.json({ success: true, id: result.lastInsertRowid, name, email, role: 'user' });
  } catch (e) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = queryOne('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
  if (user) {
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/addresses', (req, res) => {
  const userId = req.query.userId;
  const addresses = queryAll('SELECT * FROM addresses WHERE user_id = ?', [userId]);
  res.json(addresses);
});

app.post('/api/addresses', (req, res) => {
  const { userId, label, fullAddress, city, postalCode, country } = req.body;
  const result = run(`INSERT INTO addresses (user_id, label, full_address, city, postal_code, country) VALUES (?, ?, ?, ?, ?, ?)`, [userId, label, fullAddress, city, postalCode, country]);
  res.json({ success: true, id: result.lastInsertRowid });
});

app.delete('/api/addresses/:id', (req, res) => {
  run('DELETE FROM addresses WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

app.get('/api/dump', (req, res) => {
  const dump = {
    users: queryAll('SELECT * FROM users'),
    products: queryAll('SELECT * FROM products'),
    orders: queryAll('SELECT * FROM orders'),
    addresses: queryAll('SELECT * FROM addresses')
  };
  res.json(dump);
});

app.use(express.static('.'));

const PORT = process.env.PORT || 3001;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`SQL Server running at http://localhost:${PORT}`);
    console.log('Database: velvora.db (SQLite)');
    console.log('\nAPI Endpoints:');
    console.log('  GET  /api/dump        - All SQL data');
    console.log('  GET  /api/products   - All products');
    console.log('  POST /api/products  - Add product');
    console.log('  GET  /api/orders    - All orders');
    console.log('  POST /api/orders    - Create order');
    console.log('  GET  /api/users     - All users');
    console.log('  POST /api/login     - User login');
  });
});
