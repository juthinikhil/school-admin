const express = require('express');
const app = express();
const PORT = process.env.PORT || 4002;
app.use(express.json());

let attendanceLogs = [
  { classId: 'cs101', studentId: 'stu01', status: 'present', date: '2026-10-22' },
  { classId: 'cs101', studentId: 'stu02', status: 'excused', date: '2026-10-22' }
];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'attendance-service' }));
app.get('/attendance/:classId', (req, res) => {
  const records = attendanceLogs.filter(a => a.classId === req.params.classId);
  res.json({ classId: req.params.classId, records });
});
app.post('/attendance/mark', (req, res) => {
  const log = { ...req.body, date: new Date().toISOString().split('T')[0] };
  attendanceLogs.push(log);
  res.status(201).json({ message: 'Attendance recorded', log });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Attendance Service on 0.0.0.0:${PORT}`));
