const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'school-admin-secret-key';

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'auth-service', timestamp: new Date().toISOString() });
});

app.post('/login', (req, res) => {
  const { username, role } = req.body;
  const token = jwt.sign(
    { username: username || 'demo-user', role: role || 'Student' },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.status(200).json({ message: 'Login successful', token, role: role || 'Student' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Auth Service listening on port ${PORT}`);
});
