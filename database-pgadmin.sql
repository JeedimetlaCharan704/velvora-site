-- =============================================
-- VELVORA LUXURY - PostgreSQL Database Schema
-- Run this in PgAdmin to set up the database
-- =============================================

-- Create database (Run this in psql or PgAdmin)
-- CREATE DATABASE velvora;

-- Connect to velvora database before running below

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    category VARCHAR(100),
    image TEXT,
    stock INTEGER DEFAULT 0,
    sizes JSONB DEFAULT '[]',
    colors JSONB DEFAULT '[]',
    tag VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    items JSONB NOT NULL DEFAULT '[]',
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    shipping DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    mihpayid VARCHAR(100),
    shipping_address JSONB,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ADDRESSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(100),
    full_address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ADMIN USER (Default Login)
-- =============================================
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@velvora.com', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- SAMPLE PRODUCTS
-- =============================================
INSERT INTO products (name, description, price, original_price, category, image, stock, sizes, tag) VALUES
('Silk Evening Gown', 'Elegant silk evening gown perfect for special occasions', 22499.99, 29999.99, 'women', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 15, '["XS", "S", "M", "L", "XL"]', 'new'),
('Premium Leather Jacket', 'Genuine leather jacket with modern fit', 37499.99, 44999.99, 'men', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 20, '["S", "M", "L", "XL", "XXL"]', 'new'),
('Designer Sunglasses', 'Luxury designer sunglasses with UV protection', 14999.99, 19999.99, 'accessories', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 50, '[]', 'sale'),
('Cashmere Sweater', '100% cashmere sweater for ultimate comfort', 15999.99, 21999.99, 'women', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', 25, '["XS", "S", "M", "L", "XL"]', 'new'),
('Classic Denim Jeans', 'Premium denim jeans with perfect fit', 6999.99, 9999.99, 'men', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400', 100, '["28", "30", "32", "34", "36"]', 'sale'),
('Floral Summer Dress', 'Beautiful floral print summer dress', 5999.99, 7999.99, 'women', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 50, '["XS", "S", "M", "L"]', 'new')
ON CONFLICT DO NOTHING;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- =============================================
-- VIEW: Customer Stats
-- =============================================
CREATE OR REPLACE VIEW customer_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.phone,
    u.created_at,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_spent,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON o.customer_email = u.email
GROUP BY u.id, u.name, u.email, u.phone, u.created_at;

-- =============================================
-- VIEW: Order Summary
-- =============================================
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    DATE(created_at) as order_date,
    COUNT(*) as total_orders,
    SUM(total) as daily_revenue,
    AVG(total) as avg_order_value,
    COUNT(DISTINCT customer_email) as unique_customers
FROM orders
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- =============================================
-- FUNCTION: Update timestamp trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- QUICK QUERIES FOR ADMIN
-- =============================================

-- Get all customers with stats:
-- SELECT * FROM customer_stats ORDER BY created_at DESC;

-- Get today's orders:
-- SELECT * FROM orders WHERE DATE(created_at) = CURRENT_DATE;

-- Get revenue by status:
-- SELECT status, COUNT(*), SUM(total) FROM orders GROUP BY status;

-- Top selling products (requires order_items tracking):
-- SELECT p.name, COUNT(oi.id) as times_ordered FROM products p LEFT JOIN...

-- =============================================
-- pgAdmin Setup Instructions:
-- 1. Right-click on "Servers" → Create → Server
-- 2. Name: velvora-local (or any name)
-- 3. Connection tab:
--    - Host: localhost
--    - Port: 5432
--    - Maintenance database: postgres
--    - Username: postgres
--    - Password: (your password)
-- 4. Right-click on Server → Create → Database
-- 5. Name: velvora
-- 6. Open Query Tool (right-click velvora database)
-- 7. Paste this entire script and execute (F5)
-- =============================================
