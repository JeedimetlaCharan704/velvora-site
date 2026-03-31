-- =====================================================
-- VELVORA E-COMMERCE DATABASE SETUP FOR PostgreSQL/pgAdmin
-- =====================================================

-- Create Database (Run this in pgAdmin SQL Editor)
-- CREATE DATABASE velvora;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Admin User (Password: admin123)
INSERT INTO users (name, email, password, phone, role) 
VALUES ('Admin', 'admin@velvora.com', 'admin123', '9999999999', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert Test Customer
INSERT INTO users (name, email, password, phone, role) 
VALUES ('Test Customer', 'test@velvora.com', 'test123', '8888888888', 'customer')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
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
);

-- Insert Sample Products (INR Prices)
INSERT INTO products (name, description, price, original_price, category, image, stock, sizes, colors, tag, rating) VALUES
('Classic Wool Blend Overcoat', 'Timeless wool blend overcoat with elegant lapels. Perfect for formal occasions and everyday sophistication.', 24999, 32999, 'women', 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400', 25, '["XS", "S", "M", "L", "XL"]', '["Black", "Camel", "Navy"]', 'new', 5),
('Premium Italian Leather Handbag', 'Handcrafted Italian leather handbag with gold hardware. Features multiple compartments for organized storage.', 28999, 37999, 'accessories', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', 15, '[]', '["Tan", "Black", "Burgundy"]', 'bestseller', 5),
('Silk Blend Midi Skirt', 'Elegant silk blend midi skirt with flowing silhouette. Perfect for office or evening wear.', 10999, 13999, 'women', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400', 40, '["XS", "S", "M", "L", "XL"]', '["Ivory", "Blush", "Sage"]', 'new', 4),
('Cashmere V-Neck Sweater', 'Luxuriously soft 100% cashmere sweater. Lightweight yet warm, perfect for layering.', 15999, 20999, 'women', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', 30, '["XS", "S", "M", "L", "XL"]', '["Cream", "Heather Gray", "Navy", "Burgundy"]', 'sale', 5),
('Tailored Wool Blazer', 'Impeccably tailored wool blazer with modern slim fit. Perfect for business meetings.', 22999, 28999, 'men', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', 20, '["S", "M", "L", "XL", "XXL"]', '["Charcoal", "Navy", "Black"]', 'new', 5),
('Premium Cotton Oxford Shirt', 'Crisp cotton oxford shirt with mother-of-pearl buttons. Classic American style.', 7499, 9999, 'men', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', 50, '["S", "M", "L", "XL", "XXL"]', '["White", "Light Blue", "Pink"]', 'bestseller', 4),
('Designer Aviator Sunglasses', 'Premium metal frame sunglasses with UV400 protection. Includes luxury hard case.', 12999, 15999, 'accessories', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', 35, '[]', '["Gold", "Silver", "Rose Gold"]', 'sale', 4),
('Kids Designer Party Dress', 'Adorable party dress with tulle overlay and sequin details. Perfect for special occasions.', 6499, 8299, 'kids', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400', 25, '["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"]', '["Pink", "Lavender", "Red"]', 'new', 5),
('Slim Fit Dark Wash Jeans', 'Premium stretch denim with modern slim fit. Comfortable all-day wear.', 8299, 11499, 'men', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400', 45, '["28", "30", "32", "34", "36", "38"]', '["Dark Blue", "Black"]', 'sale', 4),
('Leather Card Wallet', 'Slim genuine leather card wallet with RFID blocking. Holds up to 8 cards.', 4999, 6499, 'accessories', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400', 60, '[]', '["Black", "Brown", "Navy"]', 'bestseller', 4),
('Floral Print Maxi Dress', 'Bohemian-inspired maxi dress with flattering wrap silhouette. Perfect for summer events.', 9999, 12999, 'women', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 35, '["XS", "S", "M", "L", "XL"]', '["Floral Blue", "Floral Pink", "Floral Green"]', 'new', 5),
('Boys Formal Suit Set', 'Complete suit set including blazer, pants, and tie. Perfect for weddings and special events.', 10999, 13999, 'kids', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', 20, '["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"]', '["Navy", "Gray", "Black"]', 'bestseller', 5),
('Silk Pocket Square Set', 'Set of 3 premium silk pocket squares with elegant patterns. Gift-boxed.', 3999, 5499, 'accessories', 'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=400', 40, '[]', '["Classic Set", "Modern Set", "Bold Set"]', 'sale', 4),
('Cashmere Blend Scarf', 'Luxuriously soft cashmere blend scarf. Oversized for maximum warmth and style.', 7499, 9999, 'accessories', 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400', 50, '[]', '["Camel", "Gray", "Burgundy", "Navy"]', 'new', 5),
('Premium Leather Belt', 'Handcrafted genuine leather belt with brushed silver buckle. 1.25 inch width.', 5799, 7499, 'accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 55, '["S", "M", "L", "XL"]', '["Black", "Brown", "Tan"]', 'bestseller', 4),
('Kids Knit Sweater', 'Cozy knit sweater perfect for layering. Soft cotton blend for sensitive skin.', 3999, 5499, 'kids', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400', 40, '["2-3Y", "4-5Y", "6-7Y", "8-9Y"]', '["Cream", "Navy", "Sage", "Rose"]', 'sale', 4);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
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
);

-- =====================================================
-- ADDRESSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(100),
    full_address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- QUERIES FOR VIEWING DATA
-- =====================================================

-- View all users
-- SELECT * FROM users;

-- View all products
-- SELECT * FROM products;

-- View all orders with customer details
-- SELECT o.*, u.name as customer_name FROM orders o LEFT JOIN users u ON o.customer_email = u.email ORDER BY o.created_at DESC;

-- View order items (JSON)
-- SELECT order_id, jsonb_pretty(items) as items FROM orders;

-- View products by category
-- SELECT category, COUNT(*) as count FROM products GROUP BY category;

-- View orders by status
-- SELECT status, COUNT(*) as count FROM orders GROUP BY status;

-- View revenue summary
-- SELECT 
--     COUNT(*) as total_orders,
--     SUM(total) as total_revenue,
--     AVG(total) as avg_order_value
-- FROM orders WHERE payment_status = 'success';

-- =====================================================
-- ENVIRONMENT VARIABLES (.env file)
-- =====================================================
-- PGHOST=your_host
-- PGPORT=5432
-- PGDATABASE=velvora
-- PGUSER=postgres
-- PGPASSWORD=your_password
-- PAYU_KEY=your_payu_key
-- PAYU_SALT=your_payu_salt
-- PAYU_TEST=true
