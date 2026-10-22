const express = require('express');
const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'attendance-service', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Attendance Service listening on 0.0.0.0:${PORT}`);
});
