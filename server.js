const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_DIR = './data';
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const initData = () => {
  if (!fs.existsSync('./data/products.json')) {
    const products = [
      { _id: "1", name: "Silk Evening Gown", description: "Elegant silk evening gown perfect for special occasions", price: 299.99, originalPrice: 399.99, category: "women", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", stock: 15, sizes: ["XS", "S", "M", "L", "XL"], colors: ["Black", "Navy", "Burgundy"], tag: "new", rating: 5 },
      { _id: "2", name: "Premium Leather Jacket", description: "Genuine leather jacket with modern fit", price: 449.99, originalPrice: 549.99, category: "men", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", stock: 20, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "Brown"], tag: "new", rating: 5 },
      { _id: "3", name: "Designer Sunglasses", description: "Luxury designer sunglasses with UV protection", price: 189.99, originalPrice: 249.99, category: "accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", stock: 50, sizes: [], colors: ["Gold", "Silver", "Black"], tag: "sale", rating: 4 },
      { _id: "4", name: "Cashmere Sweater", description: "100% cashmere sweater for ultimate comfort", price: 199.99, originalPrice: 279.99, category: "women", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400", stock: 25, sizes: ["XS", "S", "M", "L", "XL"], colors: ["Cream", "Gray", "Pink", "Blue"], tag: "new", rating: 5 },
      { _id: "5", name: "Classic Denim Jeans", description: "Premium denim jeans with perfect fit", price: 89.99, originalPrice: 129.99, category: "men", image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400", stock: 100, sizes: ["28", "30", "32", "34", "36"], colors: ["Blue", "Black"], tag: "sale", rating: 4 },
      { _id: "6", name: "Floral Summer Dress", description: "Beautiful floral print summer dress", price: 79.99, originalPrice: 99.99, category: "women", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400", stock: 50, sizes: ["XS", "S", "M", "L"], colors: ["Pink", "Blue", "White"], tag: "new", rating: 4 },
      { _id: "7", name: "Leather Belt", description: "Genuine leather belt with silver buckle", price: 49.99, originalPrice: 69.99, category: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", stock: 75, sizes: ["S", "M", "L", "XL"], colors: ["Black", "Brown"], tag: "sale", rating: 4 },
      { _id: "8", name: "Kids Party Wear", description: "Elegant party wear for kids", price: 59.99, originalPrice: 79.99, category: "kids", image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400", stock: 30, sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], colors: ["Red", "Blue", "Pink"], tag: "new", rating: 5 },
      { _id: "9", name: "Wool Blazer", description: "Premium wool blend blazer for formal occasions", price: 349.99, originalPrice: 449.99, category: "men", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", stock: 18, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Navy", "Charcoal", "Black"], tag: "new", rating: 5 },
      { _id: "10", name: "Pearl Earrings", description: "Elegant freshwater pearl earrings", price: 89.99, originalPrice: 119.99, category: "accessories", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400", stock: 60, sizes: [], colors: ["White", "Pink", "Black"], tag: "new", rating: 4 }
    ];
    fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
  }
  if (!fs.existsSync('./data/orders.json')) {
    const orders = [
      { _id: "1", orderId: "VEL-001", customer: { name: "John Doe", email: "john@example.com" }, createdAt: new Date().toISOString(), total: 299.99, status: "Pending", items: [{ name: "Silk Evening Gown", price: 299.99, quantity: 1 }] },
      { _id: "2", orderId: "VEL-002", customer: { name: "Jane Smith", email: "jane@example.com" }, createdAt: new Date(Date.now() - 86400000).toISOString(), total: 449.99, status: "Processing", items: [{ name: "Premium Leather Jacket", price: 449.99, quantity: 1 }] },
      { _id: "3", orderId: "VEL-003", customer: { name: "Mike Johnson", email: "mike@example.com" }, createdAt: new Date(Date.now() - 172800000).toISOString(), total: 189.99, status: "Shipped", items: [{ name: "Designer Sunglasses", price: 189.99, quantity: 1 }] },
      { _id: "4", orderId: "VEL-004", customer: { name: "Sarah Wilson", email: "sarah@example.com" }, createdAt: new Date(Date.now() - 259200000).toISOString(), total: 599.99, status: "Delivered", items: [{ name: "Cashmere Sweater", price: 199.99, quantity: 2 }, { name: "Leather Belt", price: 49.99, quantity: 1 }] }
    ];
    fs.writeFileSync('./data/orders.json', JSON.stringify(orders, null, 2));
  } else {
    const orders = JSON.parse(fs.readFileSync('./data/orders.json', 'utf8'));
    if (orders.length === 0) {
      const sampleOrders = [
        { _id: "1", orderId: "VEL-001", customer: { name: "John Doe", email: "john@example.com" }, createdAt: new Date().toISOString(), total: 299.99, status: "Pending", items: [{ name: "Silk Evening Gown", price: 299.99, quantity: 1 }] },
        { _id: "2", orderId: "VEL-002", customer: { name: "Jane Smith", email: "jane@example.com" }, createdAt: new Date(Date.now() - 86400000).toISOString(), total: 449.99, status: "Processing", items: [{ name: "Premium Leather Jacket", price: 449.99, quantity: 1 }] },
        { _id: "3", orderId: "VEL-003", customer: { name: "Mike Johnson", email: "mike@example.com" }, createdAt: new Date(Date.now() - 172800000).toISOString(), total: 189.99, status: "Shipped", items: [{ name: "Designer Sunglasses", price: 189.99, quantity: 1 }] },
        { _id: "4", orderId: "VEL-004", customer: { name: "Sarah Wilson", email: "sarah@example.com" }, createdAt: new Date(Date.now() - 259200000).toISOString(), total: 599.99, status: "Delivered", items: [{ name: "Cashmere Sweater", price: 199.99, quantity: 2 }, { name: "Leather Belt", price: 49.99, quantity: 1 }] }
      ];
      fs.writeFileSync('./data/orders.json', JSON.stringify(sampleOrders, null, 2));
    }
  }
  if (!fs.existsSync('./data/users.json')) {
    fs.writeFileSync('./data/users.json', JSON.stringify([], null, 2));
  }
};

initData();

function safeReadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [];
  }
}

function safeWriteJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];

  if (url === '/api/products') {
    if (req.method === 'GET') {
      const products = safeReadJson('./data/products.json');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(products));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const products = safeReadJson('./data/products.json');
          const product = JSON.parse(body);
          if (!product.name || !product.price) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Invalid product data' }));
          }
          product._id = Date.now().toString();
          product.createdAt = new Date().toISOString();
          products.push(product);
          safeWriteJson('./data/products.json', products);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(product));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else {
      res.writeHead(405);
      res.end();
    }
    return;
  }

  if (url === '/api/orders') {
    if (req.method === 'GET') {
      const orders = safeReadJson('./data/orders.json');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ orders, total: orders.length }));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const orders = safeReadJson('./data/orders.json');
          const order = JSON.parse(body);
          
          if (!order.customerEmail || !order.items || order.items.length === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Invalid order data' }));
          }
          
          order._id = Date.now().toString();
          order.orderId = order.orderId || 'VEL-' + Date.now();
          order.createdAt = new Date().toISOString();
          order.status = order.status || 'Pending';
          
          orders.unshift(order);
          safeWriteJson('./data/orders.json', orders);
          
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, order }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else {
      res.writeHead(405);
      res.end();
    }
    return;
  }

  if (url === '/api/login') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { email, password } = JSON.parse(body);
          const users = safeReadJson('./data/users.json');
          const user = users.find(u => u.email === email && u.password === password);
          
          if (user) {
            const { password: _, ...userWithoutPassword } = user;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, user: userWithoutPassword }));
          } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Invalid credentials' }));
          }
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else {
      res.writeHead(405);
      res.end();
    }
    return;
  }

  if (url === '/api/users') {
    if (req.method === 'GET') {
      const users = safeReadJson('./data/users.json');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const users = safeReadJson('./data/users.json');
          const userData = JSON.parse(body);
          
          if (!userData.email || !userData.name || !userData.password) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Missing required fields' }));
          }
          
          if (users.find(u => u.email === userData.email)) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Email already exists' }));
          }
          
          const user = {
            ...userData,
            _id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          users.push(user);
          safeWriteJson('./data/users.json', users);
          
          const { password: _, ...userWithoutPassword } = user;
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, user: userWithoutPassword }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else {
      res.writeHead(405);
      res.end();
    }
    return;
  }

  if (url.includes('..')) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid path' }));
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
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
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
  console.log('  GET    /api/products - Get all products');
  console.log('  POST   /api/products - Add new product');
  console.log('  GET    /api/orders   - Get all orders');
  console.log('  POST   /api/orders   - Create new order');
  console.log('  POST   /api/login    - User login');
  console.log('  GET    /api/users    - Get all users');
  console.log('  POST   /api/users    - Register new user');
});
