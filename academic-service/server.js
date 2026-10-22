const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'academic-service', timestamp: new Date().toISOString() });
});

app.get('/courses', (req, res) => {
  res.status(200).json({
    courses: [
      { id: 'cs101', name: 'Computer Science 101', teacher: 'Prof. Alan' },
      { id: 'math201', name: 'Calculus II', teacher: 'Dr. Gauss' }
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Academic Service listening on port ${PORT}`);
});
