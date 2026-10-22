const express = require('express');
const app = express();
const PORT = process.env.PORT || 4004;
app.use(express.json());

let notices = [
  { id: 1, title: 'Term Finals Schedule', target: 'All', message: 'Final exams begin November 15th.', date: '2026-10-20' },
  { id: 2, title: 'Teacher-Parent Conference', target: 'Parents', message: 'Annual meeting this Friday at 4 PM.', date: '2026-10-22' }
];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'comms-service' }));
app.get('/notices', (req, res) => res.json({ notices }));
app.post('/notices', (req, res) => {
  const note = { id: Date.now(), ...req.body, date: new Date().toISOString().split('T')[0] };
  notices.unshift(note);
  res.status(201).json(note);
});

app.listen(PORT, '0.0.0.0', () => console.log(`Comms Service on 0.0.0.0:${PORT}`));
