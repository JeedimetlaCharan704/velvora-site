const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/velvora');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  image: String,
  stock: Number,
  sizes: [String],
  colors: [String],
  tag: String,
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  address: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const products = [
  {
    name: "Silk Evening Gown",
    description: "Elegant silk evening gown perfect for special occasions",
    price: 299.99,
    originalPrice: 399.99,
    category: "women",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
    stock: 15,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy"],
    tag: "new",
    rating: 5
  },
  {
    name: "Premium Leather Jacket",
    description: "Genuine leather jacket with modern fit",
    price: 449.99,
    originalPrice: 549.99,
    category: "men",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    stock: 20,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Brown"],
    tag: "new",
    rating: 5
  },
  {
    name: "Designer Sunglasses",
    description: "Luxury designer sunglasses with UV protection",
    price: 189.99,
    originalPrice: 249.99,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    stock: 50,
    sizes: [],
    colors: ["Gold", "Silver", "Black"],
    tag: "new",
    rating: 4
  },
  {
    name: "Cashmere Sweater",
    description: "100% cashmere sweater for ultimate comfort",
    price: 199.99,
    originalPrice: 279.99,
    category: "women",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
    stock: 25,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Pink", "Blue"],
    tag: "new",
    rating: 5
  }
];

async function seedProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    await Product.insertMany(products);
    console.log('Added 4 new products with "new" tag');
    
    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@velvora.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@velvora.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user created: admin@velvora.com / admin123');
    }
    
    console.log('Seed completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding:', error.message);
    process.exit(1);
  }
}

seedProducts();
