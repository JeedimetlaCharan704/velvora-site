const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const initData = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  const usersPath = path.join(DATA_DIR, 'users.json');
  if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, JSON.stringify([], null, 2));
  }
};

initData();

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const usersPath = path.join(DATA_DIR, 'users.json');

  try {
    if (req.method === 'GET') {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      const usersWithoutPassword = users.map(u => ({ ...u, password: undefined }));
      return res.status(200).json(usersWithoutPassword);
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const { action, email, password, name, phone } = JSON.parse(body);

        if (action === 'register') {
          const existingUser = users.find(u => u.email === email);
          if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
          }
          
          const newUser = {
            _id: Date.now().toString(),
            name,
            email,
            password,
            phone: phone || '',
            role: 'user',
            createdAt: new Date().toISOString()
          };
          
          users.push(newUser);
          fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
          
          const { password: _, ...userWithoutPassword } = newUser;
          return res.status(201).json(userWithoutPassword);
        }

        if (action === 'login') {
          const user = users.find(u => u.email === email && u.password === password);
          
          if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
          }

          if (email === 'admin@velvora.com' && password === 'admin123') {
            user.role = 'admin';
          }
          
          const { password: _, ...userWithoutPassword } = user;
          return res.status(200).json(userWithoutPassword);
        }

        return res.status(400).json({ error: 'Invalid action' });
      });
      return;
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
