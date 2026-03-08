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

  try {
    const mongoClient = await getClient();
    const db = mongoClient.db('velvora');
    const orders = db.collection('orders');

    if (req.method === 'GET') {
      const allOrders = await orders.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ orders: allOrders, total: allOrders.length });
    }

    if (req.method === 'POST') {
      const order = JSON.parse(req.body);
      order.orderId = 'VEL-' + Date.now();
      order.createdAt = new Date();
      order.status = 'Pending';
      const result = await orders.insertOne(order);
      order._id = result.insertedId;
      return res.status(201).json({ order });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
};
