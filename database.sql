-- PostgreSQL Database Setup for Velvora E-commerce
-- Run this in pgAdmin or psql

-- Create database
CREATE DATABASE velvora;

-- Connect to velvora database
\c velvora;

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category VARCHAR(100) NOT NULL,
    image TEXT,
    stock INTEGER DEFAULT 0,
    sizes TEXT,
    colors TEXT,
    tag VARCHAR(50),
    rating DECIMAL(2,1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(100) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES users(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    shipping_address JSONB,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Addresses Table
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    label VARCHAR(100),
    full_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(50) NOT NULL,
    country VARCHAR(100) DEFAULT 'US',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Data
-- Users
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@velvora.com', 'admin123', 'admin'),
('Demo User', 'user@velvora.com', 'user123', 'user');

-- Products
INSERT INTO products (name, description, price, original_price, category, image, stock, sizes, colors, tag, rating) VALUES 
('Silk Evening Gown', 'Elegant silk evening gown perfect for special occasions', 299.99, 399.99, 'women', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 15, 'XS,S,M,L,XL', 'Black,Navy,Burgundy', 'new', 5),
('Premium Leather Jacket', 'Genuine leather jacket with modern fit', 449.99, 549.99, 'men', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 20, 'S,M,L,XL,XXL', 'Black,Brown', 'new', 5),
('Designer Sunglasses', 'Luxury designer sunglasses with UV protection', 189.99, 249.99, 'accessories', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 50, '', 'Gold,Silver,Black', 'sale', 4),
('Cashmere Sweater', '100% cashmere sweater for ultimate comfort', 199.99, 279.99, 'women', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', 25, 'XS,S,M,L,XL', 'Cream,Gray,Pink,Blue', 'new', 5),
('Classic Denim Jeans', 'Premium denim jeans with perfect fit', 89.99, 129.99, 'men', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400', 100, '28,30,32,34,36', 'Blue,Black', 'sale', 4),
('Floral Summer Dress', 'Beautiful floral print summer dress', 79.99, 99.99, 'women', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 50, 'XS,S,M,L', 'Pink,Blue,White', 'new', 4),
('Leather Belt', 'Genuine leather belt with silver buckle', 49.99, 69.99, 'accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 75, 'S,M,L,XL', 'Black,Brown', 'sale', 4),
('Kids Party Wear', 'Elegant party wear for kids', 59.99, 79.99, 'kids', 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400', 30, '2-3Y,4-5Y,6-7Y,8-9Y', 'Red,Blue,Pink', 'new', 5),
('Wool Blazer', 'Premium wool blend blazer for formal occasions', 349.99, 449.99, 'men', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', 18, 'S,M,L,XL,XXL', 'Navy,Charcoal,Black', 'new', 5),
('Pearl Earrings', 'Elegant freshwater pearl earrings', 89.99, 119.99, 'accessories', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', 60, '', 'White,Pink,Black', 'new', 4);

-- Orders
INSERT INTO orders (order_id, customer_name, customer_email, items, subtotal, tax, shipping, total, status) VALUES 
('VEL-001', 'John Doe', 'john@example.com', '[{"name":"Silk Evening Gown","price":299.99,"quantity":1}]', 299.99, 24.00, 0, 323.99, 'Pending'),
('VEL-002', 'Jane Smith', 'jane@example.com', '[{"name":"Premium Leather Jacket","price":449.99,"quantity":1}]', 449.99, 36.00, 0, 485.99, 'Processing'),
('VEL-003', 'Mike Johnson', 'mike@example.com', '[{"name":"Designer Sunglasses","price":189.99,"quantity":1}]', 189.99, 15.20, 0, 205.19, 'Shipped');
