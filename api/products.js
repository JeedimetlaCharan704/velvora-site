const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'velvora_admin_secret_key_2024';

let client;
let clientPromise;

async function getClient() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not configured');
  }
  if (!client) {
    client = new MongoClient(MONGODB_URI);
  }
  return client;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!MONGODB_URI) {
    return res.status(500).json({ error: 'Database not configured. Add MONGODB_URI to Vercel environment variables.' });
  }

  try {
    const mongoClient = await getClient();
    const db = mongoClient.db('velvora');
    const products = db.collection('products');

    if (req.method === 'GET') {
      const allProducts = await products.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(allProducts);
    }

    if (req.method === 'POST') {
      const product = JSON.parse(req.body);
      product.createdAt = new Date();
      const result = await products.insertOne(product);
      product._id = result.insertedId;
      return res.status(201).json(product);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
};
