const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'velvora_admin_secret_key_2024';

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
    return res.status(500).json({ error: 'Database not configured. Add MONGODB_URI to Vercel environment variables.' });
  }

  try {
    const mongoClient = await getClient();
    const db = mongoClient.db('velvora');
    const users = db.collection('users');

    if (req.method === 'GET') {
      const authHeader = req.headers.authorization;
      const allUsers = await users.find({}).toArray();
      const usersWithoutPassword = allUsers.map(u => ({ ...u, password: undefined }));
      return res.status(200).json(usersWithoutPassword);
    }

    if (req.method === 'POST') {
      const { action, email, password, name, phone } = JSON.parse(req.body);

      if (action === 'register') {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: 'Email already registered' });
        }
        
        const newUser = {
          name,
          email,
          password,
          phone: phone || '',
          role: 'user',
          createdAt: new Date()
        };
        
        const result = await users.insertOne(newUser);
        newUser._id = result.insertedId;
        delete newUser.password;
        
        return res.status(201).json(newUser);
      }

      if (action === 'login') {
        const user = await users.findOne({ email, password });
        
        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (email === 'admin@velvora.com' && password === 'admin123') {
          user.role = 'admin';
        }
        
        delete user.password;
        return res.status(200).json(user);
      }

      return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
};
