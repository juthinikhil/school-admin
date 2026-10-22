const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'school-admin-secret-key';

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth-service', timestamp: new Date().toISOString() }));

app.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !role) return res.status(400).json({ error: 'Username and role required' });
  res.status(201).json({ message: 'User registered successfully', username, role });
});

app.post('/login', (req, res) => {
  const { username, role } = req.body;
  const token = jwt.sign({ username: username || 'demo-user', role: role || 'Student' }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: username || 'demo-user', role: role || 'Student' });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Auth Service listening on 0.0.0.0:${PORT}`));
