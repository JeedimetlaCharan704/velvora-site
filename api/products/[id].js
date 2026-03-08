const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

let client;

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
    return res.status(500).json({ error: 'Database not configured' });
  }

  const { id } = req.query;
  
  try {
    const mongoClient = await getClient();
    const db = mongoClient.db('velvora');
    const products = db.collection('products');

    if (req.method === 'GET') {
      const product = await products.findOne({ _id: new ObjectId(id) });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json(product);
    }

    if (req.method === 'PUT') {
      const updateData = JSON.parse(req.body);
      delete updateData._id;
      const result = await products.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      return res.status(200).json(result);
    }

    if (req.method === 'DELETE') {
      await products.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ message: 'Product deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
};
