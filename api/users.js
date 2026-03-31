require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false,
    require: true 
  }
});

// Test connection on startup
pool.query('SELECT 1')
  .then(() => console.log('✅ Supabase connected'))
  .catch(err => console.log('⚠️ DB connection issue:', err.message));

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT id, name, email, phone, role, created_at FROM users');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.rows));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Database connection failed', details: e.message }));
    }
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const userData = JSON.parse(body);
        
        // Validate required fields
        if (!userData.name || !userData.email || !userData.password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields: name, email, password' }));
          return;
        }
        
        const result = await pool.query(
          `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [userData.name, userData.email, userData.password, userData.phone || null, userData.role || 'customer']
        );
        
        const user = result.rows[0];
        const { password, ...userWithoutPassword } = user;
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: userWithoutPassword }));
      } catch (e) {
        console.error('User creation error:', e.message);
        if (e.code === '23505') {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Email already exists' }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to create user', details: e.message }));
        }
      }
    });
  } else {
    res.writeHead(405);
    res.end();
  }
};