const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function ensureProductsFile() {
    const productsPath = path.join(DATA_DIR, 'products.json');
    if (!fs.existsSync(productsPath)) {
        const products = [
            { id: "1", name: "Classic Wool Blend Overcoat", description: "Timeless wool blend overcoat", price: 24999, original_price: 32999, category: "women", image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400", stock: 25, sizes: ["XS", "S", "M", "L", "XL"], colors: ["Black", "Camel", "Navy"], tag: "new", rating: 5 },
            { id: "2", name: "Premium Italian Leather Handbag", description: "Handcrafted Italian leather handbag", price: 28999, original_price: 37999, category: "accessories", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400", stock: 15, sizes: [], colors: ["Tan", "Black", "Burgundy"], tag: "bestseller", rating: 5 }
        ];
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    }
    return path.join(DATA_DIR, 'products.json');
}

module.exports = async function handler(req, res) {
    ensureDataDir();
    
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const productsPath = ensureProductsFile();

    try {
        if (req.method === 'GET') {
            const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
            return res.status(200).json(products);
        }

        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
            const product = {
                id: Date.now().toString(),
                ...body,
                created_at: new Date().toISOString()
            };
            products.push(product);
            fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
            return res.status(201).json(product);
        }

        if (req.method === 'PUT') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
            const index = products.findIndex(p => p.id === req.query.id);
            if (index !== -1) {
                products[index] = { ...products[index], ...body, updated_at: new Date().toISOString() };
                fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
                return res.status(200).json(products[index]);
            }
            return res.status(404).json({ error: 'Product not found' });
        }

        if (req.method === 'DELETE') {
            const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
            const filtered = products.filter(p => p.id !== req.query.id);
            fs.writeFileSync(productsPath, JSON.stringify(filtered, null, 2));
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Products API Error:', error);
        return res.status(500).json({ error: error.message });
    }
};
