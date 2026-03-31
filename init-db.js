require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function initTables() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      role VARCHAR(50) DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log('Users table created');

    await sql`CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      original_price DECIMAL(10, 2),
      category VARCHAR(100) NOT NULL,
      image TEXT,
      stock INTEGER DEFAULT 0,
      sizes JSONB DEFAULT '[]',
      colors JSONB DEFAULT '[]',
      tag VARCHAR(50),
      rating INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log('Products table created');

    await sql`CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(100) UNIQUE NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50),
      items JSONB NOT NULL,
      subtotal DECIMAL(10, 2) NOT NULL,
      tax DECIMAL(10, 2) DEFAULT 0,
      shipping DECIMAL(10, 2) DEFAULT 0,
      total DECIMAL(10, 2) NOT NULL,
      payment_method VARCHAR(50) DEFAULT 'payu',
      payment_status VARCHAR(50) DEFAULT 'pending',
      mihpayid VARCHAR(100),
      shipping_address JSONB,
      status VARCHAR(50) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log('Orders table created');

    console.log('All tables initialized successfully!');
  } catch (e) {
    console.error('Error creating tables:', e.message);
  }
  process.exit(0);
}

initTables();